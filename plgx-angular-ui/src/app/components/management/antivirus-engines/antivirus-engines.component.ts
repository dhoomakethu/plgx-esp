import { Component, OnInit } from '@angular/core';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import { CommonVariableService } from '../../../dashboard/_services/commonvariable.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-antivirus-engines',
  templateUrl: './antivirus-engines.component.html',
  styleUrls: ['./antivirus-engines.component.css','./antivirus-engines.component.scss']
})
export class AntivirusEnginesComponent implements OnInit {
 av_engines_data={};
 av_engines_data_table1={}
 av_engines_data_table2={}
 av_engines_data_table3={}
 av_engines_data_table4={}
 av_engines={}
 apikey_data:any;
 ProjectName=this.commonvariable.APP_NAME
  constructor(
    private commonapi: CommonapiService,
    private commonvariable: CommonVariableService,
    private _location: Location,
    private titleService: Title,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.commonvariable.APP_NAME+"-"+"Antivirus-Engines");
    this.commonapi.getAntiVirusEngines().subscribe((res: any) => {
        $('.hide_av_engines_data').hide();
        if( res.data.min_match_count && res.data.av_engines){
          $('.show_av_engines_data').show();
        }else{
          $('.no_data').append('No data Present')
        }
      this.av_engines_data['min_match_count']=res.data.min_match_count
      // this.av_engines_data['av_engines']=res.data.av_engines
      var keys =  Object.keys(res.data.av_engines);
      let length = Math.ceil(keys.length/4)
      keys=keys.sort()
      let table1={}
      for (let i = 0; i < length; i++) {
        table1[keys[i]]=res.data.av_engines[keys[i]]
      }
      this.av_engines_data_table1['av_engines']=table1
      let table2={}
      for (let i = length; i <length*2; i++) {
        table2[keys[i]]=res.data.av_engines[keys[i]]
      }
      this.av_engines_data_table2['av_engines']=table2
      let table3={}
      for (let i = length*2; i <length*3; i++) {
        table3[keys[i]]=res.data.av_engines[keys[i]]
      }
      this.av_engines_data_table3['av_engines']=table3
      let table4={}
      for (let i = length*3; i <keys.length; i++) {
        table4[keys[i]]=res.data.av_engines[keys[i]]
      }
      this.av_engines_data_table4['av_engines']=table4
    })
  }

  get_changed_data(data){
    for (let key in data) {
      this.av_engines[key] = data[key];
  }
    this.av_engines_data['av_engines']=this.av_engines
  }
  get_changed_data_table2(data){
    for (let key in data) {
      this.av_engines[key] = data[key];
  }
  this.av_engines_data['av_engines']=this.av_engines
  }
  get_changed_data_table3(data){
    for (let key in data) {
      this.av_engines[key] = data[key];
  }
  this.av_engines_data['av_engines']=this.av_engines
  }
  get_changed_data_table4(data){
    for (let key in data) {
      this.av_engines[key] = data[key];
  }
  this.av_engines_data['av_engines']=this.av_engines
  }
  onSubmit(){
    this.commonapi.Apikey_data().subscribe(res => {
      this.apikey_data = res;
      console.log(this.apikey_data);
      if(this.apikey_data.data ==undefined){
        Swal.fire({
          text: "Virustotal key is not configured. Please configure it and retry",
          })
      }
      else{
        this.update()
      }

    })
  }

update(){
  if(this.av_engines_data['min_match_count'] <=0){
    Swal.fire({
      text: "Please provide minimum count greater than or equal to 1",
      })
  }else{
  Swal.fire({
    title: 'Are you sure want to update?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#518c24',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Update!'
  }).then((result) => {
    if (result.value) {
  this.commonapi.postAntiVirusEngines(this.av_engines_data).subscribe((res: any) => {
    if(res.status=='success'){
      Swal.fire({
        icon: 'success',
        title:"Successfully updated",
        showConfirmButton: false,
        timer: 1500,
        })
    }else{
      Swal.fire({
        icon: 'warning',
        title: res.status,
        text: res.message,
        showConfirmButton: false,
        timer: 2000

      })
    }
  })
}
})
}
}

goBack(){
  this._location.back();
}
}
