import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as $ from 'jquery';
import {ElementRef, Injectable, ViewChild} from '@angular/core';
@Injectable()
export class GeneratePdfService {

    constructor() { }


    /*@ViewChild('fiche') content: ElementRef;

    generate(name:string,content:string) {
      let doc = new jsPDF();
      doc.addHTML(this.content.nativeElement, function() {
        doc.save("obrz.pdf");
      });
    }*/

    generate(name:string,content:string) {

        let data = document.getElementById(content);
        html2canvas(data).then(canvas => {

          let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

          let imgWidth = pdf.internal.pageSize.getWidth();
          console.log(imgWidth)
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          console.log(imgHeight)
          const contentDataURL = canvas.toDataURL('image/png');

            pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth,imgHeight,"",'FAST',359);

          pdf.save(name+'.pdf'); // Generated PDF
        });

    }


  /* generate(name:string,content:string) {

    let data = document.getElementById(content);
    html2canvas(data).then(canvas => {


      let pdf = new jsPDF('p', 'mm', 'A4'); // A4 size page of PDF

      //const pdfWidth = pdf.internal.pageSize.getWidth();
      //const pdfWidth = 280;

      //var imgHeight = (canvas.height * pdfWidth) / canvas.width;
      //var imgHeight = 280;

      /!*var width = $('#content').width();
      var height = (canvas.height * width) / canvas.width;*!/

      let width = pdf.internal.pageSize.getWidth();
      let height = (canvas.height * width) / canvas.width;

      //var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'JPEG', 0, 0, width, height);

      /!*  while (heightLeft >= 0) {
          var position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, pdfWidth, imgHeight+20);
           heightLeft -= pageHeight;
       }
       var pageCount = pdf.internal.getNumberOfPages();

       console.log(pageCount) *!/
      pdf.save(name+'.pdf'); // Generated PDF
    });

  }*/


}
