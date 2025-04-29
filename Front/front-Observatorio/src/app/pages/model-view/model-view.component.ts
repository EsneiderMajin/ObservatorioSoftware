import { Component } from '@angular/core';

@Component({
  selector: 'app-model-view',
  templateUrl: './model-view.component.html',
  styleUrls: ['./model-view.component.css']
})
export class ModelViewComponent {


ngOnInit() {
  this.loadPdf();
}

private loadPdf(): void {
  const pdfFrame = document.getElementById('pdfFrame');
  if (pdfFrame) {
    pdfFrame.setAttribute('src', '../../../../assets/ModeloObservatorio.pdf');
  }
}
  

}
