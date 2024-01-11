import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>){}

  sumaIngresos:number = 0;
  sumaEgresos:number = 0;
  
  totalIngresos: number = 0;
  totalEgresos: number = 0;

  subsEstadisticas!: Subscription;

  doughnutChartLabels: string[] = [
    'Ingresos',
    'Egresos',
    
  ];
  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [] }

    ]
  };



  ngOnInit(): void {
    this.subsEstadisticas = this.store.select('ingresosEgresos')
                               .subscribe( ({items}) => this.generarEstadistica(items));
  }    
  
  ngOnDestroy(): void {
    this.subsEstadisticas.unsubscribe();
  }

  generarEstadistica (items: any[]){
    console.log("Se recupera actualizacion del storeeee");
    console.log(items);
    this.sumaIngresos = 0;
    this.sumaEgresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;

    items.map(item =>{
      if (item.tipo==='ingreso'){
        this.totalIngresos ++;
        this.sumaIngresos += item.monto;
      }else {
        this.totalEgresos ++;
        this.sumaEgresos += item.monto;
      }     
    }); 
    console.log('Actualizo grafica' +this.sumaIngresos + "---" + this.sumaEgresos );
    this.doughnutChartData ={
      labels: this.doughnutChartLabels,   
      datasets: [{data:[this.sumaIngresos,this.sumaEgresos]}]
    };
  }

}
