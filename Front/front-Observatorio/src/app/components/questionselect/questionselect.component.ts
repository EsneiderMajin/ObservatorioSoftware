import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Questions, Option, MatrixRow, } from 'src/app/core/models/observatorio.model';

@Component({
  selector: 'app-questionselect',
  templateUrl: './questionselect.component.html',
  styleUrls: ['./questionselect.component.css']
})
export class QuestionselectComponent implements OnInit, OnChanges  {
  @Input() questions!: Questions[];
  @Input() category!: string;
  @Output() answered = new EventEmitter<any>();
  botonSend = "Siguiente";

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
    return (this.questionsArray.at(index) as FormGroup).get('form') as FormGroup;
  }

  getMatrixGroup(i: number): FormGroup {
    return this.getFormGroup(i).get('matrix') as FormGroup;
  }

  private initForm(): void {
    if(this.category === "preguntasDesafios"){
      this.botonSend = "Enviar";
    }
    const questionsArray = this.fb.array<FormGroup>([]);
    this.questions.forEach((question) => {
      let group: FormGroup;

      switch (question.type) {
        case 'single':
          group = this.fb.group({
            response: ['', Validators.required],
            otroTexto: ['']
          });
          break;

        case 'multiple':
          group = this.fb.group({
            selectedOptions: [[]],
            otroTexto: ['']
          });
          break;

        case 'matrix':
          // Para cada fila, creamos un control dentro de un grupo
          const matrixGroup = this.fb.group({});
          question.rows?.forEach((row: MatrixRow) => {
            matrixGroup.addControl(row.value, this.fb.control(null));
          });
          group = this.fb.group({
            matrix: matrixGroup
          });
          break;

        default:
          group = this.fb.group({});
          break;
      }

      // Cada elemento del array tendrá además información extra (como la pregunta y el tipo)
      questionsArray.push(this.fb.group({
        questionText: [question.question],
        type: [question.type],
        form: group
      }));
    });

    this.questionsForm = this.fb.group({
      questions: questionsArray
    });
  }

  /**
   * Maneja el cambio de estado en los checkboxes para preguntas de selección múltiple.
   */
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

  /**
   * Devuelve true si se seleccionó alguna opción que requiere input (por ejemplo, "Otro")
   */
  hasOtherSelected(formValue: any, options?: Option[]): boolean {
    if (!options) return false;
    
    // Para preguntas de selección única
    if (formValue.response) {
      return options.some(
        (option) => option.hasInput && formValue.response === option.value
      );
    }
    // Para preguntas de selección múltiple
    if (formValue.selectedOptions) {
      return options.some(
        (option) => option.hasInput && formValue.selectedOptions.includes(option.value)
      );
    }
    return false;
  }

  /**
   * Maneja la selección en la matriz para cada fila
   */
  onMatrixRadioChange(rowValue: string, colValue: number, matrixGroup: FormGroup): void {
    const rowControl = matrixGroup.get(rowValue);
    if (rowControl) {
      rowControl.setValue(colValue);
    }
  }

  // onSubmit(): void {
  //   if (this.questionsForm.valid) {
  //     // Emitimos las respuestas al padre
  //     let answers: any[] = [];
  //     answers.push(this.category);
  //     answers.push(this.questionsForm.value.questions.map((q: any) => q.form));
  //     this.answered.emit(answers);
  //   } else {
  //     (this.questionsForm.get('questions') as FormArray).controls.forEach((control) => control.markAllAsTouched());
  //   }
  // }

  onSubmit(): void {
    if (this.questionsForm.valid) {
      // Obtenemos el valor completo del formulario
      const formValue = this.questionsForm.value; 
  
      // Recorremos cada elemento del array y construimos la respuesta final
      const answers = formValue.questions.map((questionData: any, index: number) => {
        const questionText = questionData.questionText;
        const type = questionData.type;
        const form = questionData.form; 
  
        let result: any = {
          question: questionText,
          type: type
        };
  
        switch (type) {
          case 'single':
            result.response = form.response;   // Opción seleccionada
            // result.otroTexto = form.otroTexto; // Texto ingresado en "Otro"
            break;
  
          case 'multiple':
            result.selectedOptions = form.selectedOptions; // Array de opciones marcadas
            // result.otroTexto = form.otroTexto;             // Texto ingresado en "Otro"
            break;
  
          case 'matrix':
            result.matrix = form.matrix; // Objeto con { [rowValue]: numberSeleccionado }
            break;
        }
  
        return result;
      });
  
      const finalPayload = {
        category: this.category,
        answers: answers
      };
  
      // Emitimos la información al componente padre
      this.answered.emit(finalPayload);
  
    } else {
      // Marca todos los controles como tocados para mostrar los errores
      (this.questionsForm.get('questions') as FormArray).controls.forEach((control) => 
        control.markAllAsTouched()
      );
    }
  }



}