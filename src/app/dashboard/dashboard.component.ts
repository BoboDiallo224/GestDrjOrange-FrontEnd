import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import * as Chart from 'chart.js';
import {DemandeServ} from '../../Service/DemandeServ';
import {TypeContrat} from '../../Model/TypeContrat';
import {TypeContratServ} from '../../Service/typeContratServ';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  canvas:any;
  ctx:any; myChart:any;
  treatedInTime:number; treatedInLate:number; treatedDemande:number;  notTreatedDemande:number;
  typeContrat: TypeContrat = null;
  listTypeContrat:Array<TypeContrat> = [];
  loading:Boolean = false;

  constructor(public demandServ:DemandeServ, private typeContratServ:TypeContratServ) { }

  ngOnInit() {

   /* setTimeout(()=>{
      this.getListTypeContrat()
    },5000);*/

    this.getListTypeContrat(); this.statistiquesDemandes(null); this.delayOfTreatedDemande(null);
  }


  async statistiquesDemandes(dataForm){
    if (dataForm == null) {
      //this.typeContrat = new TypeContrat();
      await this.getDemandeTreated('0000-00-00','0000-00-00');
      await this.getDemandeNotTreated('0000-00-00','0000-00-00')
    }
    else if (dataForm.startDate == null || dataForm.startDate == '' && dataForm.endDate == null || dataForm.endDate == '') {
      await this.getDemandeTreated('0000-00-00','0000-00-00');
      await this.getDemandeNotTreated('0000-00-00','0000-00-00')
    }
    else {
      await this.getDemandeTreated(dataForm.startDate,dataForm.endDate);
      await this.getDemandeNotTreated(dataForm.startDate,dataForm.endDate)
    }
  }

  getDemandeTreated(startDate:string, endDate:string){
    this.loading = true;
      this.demandServ.getDemandeTreated(startDate, endDate,this.typeContrat).subscribe(
        resp => {
          this.treatedDemande = resp;
          this.loading = false;
          //this.loadPieCharteDemande();
        },
        error => {
          console.log(error);
          this.loading = false;
        });

    }


  getDemandeNotTreated(startDate:string, endDate:string){//'2019-09-17', '2019-09-19'
    this.loading = true;
    this.demandServ.getDemandeNotTreated(startDate, endDate,this.typeContrat).subscribe(
      resp => {
        this.notTreatedDemande = resp;
        this.loadPieCharteDemande();
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );

  }

  async delayOfTreatedDemande(dataForm){
    if (dataForm == null) {
      //this.typeContrat = new TypeContrat();
      await this.getDemandeTreatedInTime('0000-00-00','0000-00-00');
      await this.getDemandeTreatedInLate('0000-00-00','0000-00-00')
    }

    else if (dataForm.startDate == null || dataForm.startDate == '' && dataForm.endDate == null || dataForm.endDate == '') {
      console.log("date null");
      await this.getDemandeTreatedInTime('0000-00-00','0000-00-00');
      await this.getDemandeTreatedInLate('0000-00-00','0000-00-00')
    }

    else {

      await this.getDemandeTreatedInTime(dataForm.startDate,dataForm.endDate);
      await this.getDemandeTreatedInLate(dataForm.startDate,dataForm.endDate)

    }

  }


   getDemandeTreatedInTime(startDate:string, endDate:string){
     this.loading = true;
      this.demandServ.getDemandeTreatedAtTime(startDate, endDate, this.typeContrat).subscribe(
      resp =>{
        this.treatedInTime = resp;
        this.loading = false;
        //console.log(this.typeContrat)
      },
        error => {
          console.log(error);
          this.loading = false;
        }
    );
  }

   getDemandeTreatedInLate(startDate:string, endDate:string){
     this.loading = true;
     this.demandServ.getDemandeTreatedInLate(startDate, endDate,this.typeContrat).subscribe(
       resp => {
         this.treatedInLate = resp;
         //console.log(this.typeContrat);
         this.loadPieCharte();
         this.loading = false;
       },
       error => {
         console.log(error);
         this.loading = false;
       }
     );
  }

  loadPieCharte(){

    this.canvas = document.getElementById("myChart");
    this.ctx = this.canvas.getContext("2d");

    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['Traitées à temps', 'Treatées en retard'],
        datasets: [{
          label: "Alertes",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            /*'#e3e3e3'*/'#f6b93b',
            /* '#4acccd' */'#82ccdd'
            /* '#fcc468' */
          ],
          borderWidth: 0,
          data: [this.treatedInTime, this.treatedInLate]
        }]
      },
      options: {

        legend: {

          display: true
        },

        tooltips: {
          enabled: true
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent"
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });
  }

  loadPieCharteDemande(){
    this.canvas = document.getElementById("myChart2");
    this.ctx = this.canvas.getContext("2d");

    this.myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ['Demandes Traitées','Demandes Non Traitées'],
        datasets: [{
          label: "Statistiques Demandes",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            /*'#e3e3e3'*/ /*'#f6b93b'*/ '#2CA8FF',
            /* '#4acccd' *///'#82ccdd'
            /* '#fcc468' */'#4acccd'
          ],
          borderWidth: 0,
          data: [this.treatedDemande, this.notTreatedDemande]
        }]
      },
      options: {

        legend: {

          display: true
        },

        tooltips: {
          enabled: true
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent"
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });
  }

  async getListTypeContrat(){

    this.listTypeContrat = await this.typeContratServ.getTypeContrat().toPromise();

    this.typeContrat = this.listTypeContrat[0];
  }

  onChangeType(typeContrat:TypeContrat){
    this.typeContrat = typeContrat
  }


}
