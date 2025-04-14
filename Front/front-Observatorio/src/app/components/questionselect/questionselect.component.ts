import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Questions,
  Option,
  MatrixRow,
} from 'src/app/core/models/observatorio.model';

@Component({
  selector: 'app-questionselect',
  templateUrl: './questionselect.component.html',
  styleUrls: ['./questionselect.component.css'],
})
export class QuestionselectComponent implements OnInit, OnChanges {
  @Input() questions!: Questions[];
  @Input() category!: string;
  @Output() answered = new EventEmitter<any>();

  botonSend = 'Siguiente';
  matrixError = false;

  // NUEVO: índice de la pregunta actual
  currentQuestionIndex = 0;

  questionsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] && changes['questions'].currentValue) {
      this.initForm();
    }
  }

  get questionsArray(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  }

  getFormGroup(index: number): FormGroup {
    return (this.questionsArray.at(index) as FormGroup).get(
      'form'
    ) as FormGroup;
  }

  getMatrixGroup(i: number): FormGroup {
    return this.getFormGroup(i).get('matrix') as FormGroup;
  }

  getPercentageGroup(index: number): FormGroup {
    return this.getFormGroup(index).get('percentage') as FormGroup;
  }

  private initForm(): void {
    if (this.category === 'preguntasDesafios') {
      this.botonSend = 'Enviar';
    }
    const questionsArray = this.fb.array<FormGroup>([]);

    this.questions.forEach((question) => {
      let group: FormGroup;

      switch (question.type) {
        case 'single':
          group = this.fb.group({
            response: ['', Validators.required],
            otroTexto: [''],
          });
          break;

        case 'multiple':
          group = this.fb.group({
            selectedOptions: [[], Validators.required],
            otroTexto: [''],
          });
          break;

        case 'matrix':
          // Se crea un grupo para cada fila de la matriz
          const matrixGroup = this.fb.group({});
          question.rows?.forEach((row: MatrixRow) => {
            matrixGroup.addControl(
              row.value,
              this.fb.control(null, Validators.required)
            );
          });
          group = this.fb.group({
            matrix: matrixGroup,
          });
          break;

        case 'percentage':
          // Se crea un grupo para los porcentajes con un validador global
          const percentageGroup = this.fb.group(
            {},
            { validators: this.validadorPorcentajeTotal() }
          );
          question.options?.forEach((option: Option) => {
            percentageGroup.addControl(
              option.value,
              this.fb.control(null, [Validators.required, Validators.min(0)])
            );
          });
          group = this.fb.group({
            percentage: percentageGroup,
          });
          break;
        case 'text':
          group = this.fb.group({
            response: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(50)]], // Campo requerido para texto
          });
          break;

        default:
          group = this.fb.group({});
          break;
      }

      questionsArray.push(
        this.fb.group({
          questionText: [question.questionText || question.question],
          type: [question.type],
          clase: [question.clase],
          form: group,
        })
      );
    });

    this.questionsForm = this.fb.group({
      questions: questionsArray,
    });
  }

  /**
   * Validador que suma los valores ingresados en el grupo de porcentaje y verifica que sean 100.
   */
  validadorPorcentajeTotal(): ValidatorFn {
    return (control: AbstractControl): { [clave: string]: any } | null => {
      let total = 0;
      Object.keys((control as FormGroup).controls).forEach((key) => {
        const val = control.get(key)?.value;
        total += Number(val) || 0;
      });
      return total === 100 ? null : { totalPercentage: { value: total } };
    };
  }

  onCheckboxChange(event: any, value: string, questionGroup: FormGroup): void {
    const selectedOptions: string[] = questionGroup.value.selectedOptions;
    if (event.checked) {
      selectedOptions.push(value);
    } else {
      const index = selectedOptions.indexOf(value);
      if (index !== -1) {
        selectedOptions.splice(index, 1);
      }
    }
    questionGroup.patchValue({ selectedOptions });
  }

  hasOtherSelected(formValue: any, options?: Option[]): boolean {
    if (!options) return false;
    if (formValue.response) {
      return options.some(
        (option) => option.hasInput && formValue.response === option.value
      );
    }
    if (formValue.selectedOptions) {
      return options.some(
        (option) =>
          option.hasInput && formValue.selectedOptions.includes(option.value)
      );
    }
    return false;
  }

  // MÉTODOS NUEVOS PARA NAVEGACIÓN ENTRE PREGUNTAS
  nextQuestion(): void {
    // Validamos la pregunta actual antes de avanzar
    const currentGroup = this.questionsArray.at(this.currentQuestionIndex);
    currentGroup.markAllAsTouched();

    // Si esta pregunta es de tipo 'matrix', comprobamos que esté completa
    if (this.questions[this.currentQuestionIndex].type === 'matrix') {
      const matrixGroup = this.getMatrixGroup(this.currentQuestionIndex);
      const isComplete = this.isMatrixComplete(
        matrixGroup,
        this.questions[this.currentQuestionIndex].rows || []
      );
      this.matrixError = !isComplete;
      if (!isComplete) {
        return; // No avanza si la matriz no está completa
      }
    }

    // Si el form de la pregunta actual es válido, avanzamos
    if (currentGroup.valid) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // Se invoca al cambiar un radio button en la matriz
  onMatrixRadioChange(
    rowValue: string,
    colValue: number,
    matrixGroup: FormGroup,
    index: number
  ): void {
    const rowControl = matrixGroup.get(rowValue);
    if (rowControl) {
      rowControl.setValue(colValue);
    }
    this.updateMatrixError(index);
  }

  updateMatrixError(index: number) {
    const matrixGroup = this.getMatrixGroup(index);
    const isComplete = this.isMatrixComplete(
      matrixGroup,
      this.questions[index].rows || []
    );
    this.matrixError = !isComplete;
  }

  isMatrixComplete(matrixGroup: FormGroup, rows: MatrixRow[]): boolean {
    for (const row of rows) {
      const rowControl = matrixGroup.get(row.value);
      if (!rowControl || rowControl.value === null) {
        return false;
      }
    }
    return true;
  }

  // ENVÍO FINAL DEL FORMULARIO (solo ocurre en la última pregunta)
  onSubmit(): void {
    // Antes de enviar, marcamos todo como tocado para no omitir errores
    this.questionsArray.controls.forEach((control) =>
      control.markAllAsTouched()
    );

    if (this.questionsForm.valid) {
      const formValue = this.questionsForm.value;
      const answers = formValue.questions.map(
        (questionData: any, index: number) => {
          const questionText = questionData.questionText;
          const type = questionData.type;
          const form = questionData.form;

          let result: any = {
            question: questionText,
            type: type,
            clase: questionData.clase,
          };

          switch (type) {
            case 'single':
              result.response = form.response;
              break;
            case 'multiple':
              result.selectedOptions = form.selectedOptions;
              break;
            case 'matrix':
              result.matrix = form.matrix;
              break;
            case 'percentage':
              result.percentage = form.percentage;
              break;
            case 'text':
              result.response = form.response;
              break;
          }
          return result;
        }
      );

      const finalPayload = {
        category: this.category,
        answers: answers,
      };

      this.answered.emit(finalPayload);
    } else {
      // Marca todos los controles como tocados para mostrar errores
      (this.questionsForm.get('questions') as FormArray).controls.forEach(
        (control) => control.markAllAsTouched()
      );
      // Verifica errores en matrices, si existen
      this.questions.forEach((question, index) => {
        if (question.type === 'matrix') {
          const matrixGroup = this.getMatrixGroup(index);
          const isMatrixComplete = this.isMatrixComplete(
            matrixGroup,
            question.rows || []
          );
          if (!isMatrixComplete) {
            this.matrixError = true;
          }
        }
      });
    }
  }
}
