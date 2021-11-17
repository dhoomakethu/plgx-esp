import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import { CommonVariableService } from '../../../dashboard/_services/commonvariable.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import swal from 'sweetalert';
import { Location } from '@angular/common';
import Swal from 'sweetalert2'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-intel-keys',
  templateUrl: './intel-keys.component.html',
  styleUrls: ['./intel-keys.component.css']
})

export class IntelKeysComponent implements OnInit {
  intelKeys: FormGroup;
  submitted = false;
  error: any;
  Updated = false;
  apikey_data: any;
  ibmkey= '';
  ibmpass= '';
  virustotalkey='';
  alienvaultkey= '';
  Apikeypost_data: any;
  ibmxforcekeyError: any
  virustotalError: any;
  alienvaultkeyError: any;
  ibmxforcepassError: any;
  ProjectName=this.commonvariable.APP_NAME
  constructor(
    private fb: FormBuilder,
    private commonapi: CommonapiService,
    private commonvariable: CommonVariableService,
    private _location: Location,
    private titleService: Title,

  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.commonvariable.APP_NAME+"-"+"Threat Intel Keys" );
    this.intelKeys = this.fb.group({
      ibmkey: '',
      ibmpass: '',
      virustotalkey:'',
      alienvaultkey: ''
    });
    this.commonapi.Apikey_data().subscribe(res => {
      this.apikey_data = res;
      if(this.apikey_data.data){
      if(this.apikey_data.data.ibmxforce){
        this.ibmkey = this.apikey_data.data.ibmxforce.key;
        this.ibmpass = this.apikey_data.data.ibmxforce.pass;
      }
      if(this.apikey_data.data.virustotal){
      this.virustotalkey = this.apikey_data.data.virustotal.key;
      }
      if(this.apikey_data.data.alienvault){
        this.alienvaultkey = this.apikey_data.data.alienvault.key;
      }
    }
    })

  }
  get f() { return this.intelKeys.controls; }
  onSubmit() {
    this.submitted = true;
   if(this.f.ibmkey.value=='' && this.f.ibmpass.value =='' && this.f.virustotalkey.value=='' && this.f.alienvaultkey.value==''){
    swal({
      icon: 'warning',
      // title:
      text:" Please provide atleast one key",
      buttons: [false],
      timer: 2000

  })
  }
  else{
    Swal.fire({
      title: 'Are you sure want to update?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#518c24',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.value) {
        this.commonapi.Apikey_postdata(this.f.ibmkey.value, this.f.ibmpass.value,
          this.f.virustotalkey.value, this.f.alienvaultkey.value).subscribe(res => {
          this.Apikeypost_data = res;

          if (this.Apikeypost_data.status == 'failure') {

            Swal.fire({
              icon: 'warning',
              title: this.Apikeypost_data.status,
              text: this.Apikeypost_data.message,
            })
          } else {
            Swal.fire({
              icon: 'success',
              title: this.Apikeypost_data.status,
              text: this.Apikeypost_data.message,
              showConfirmButton: true,
           })

          }
          if(this.Apikeypost_data.errors){
              this.Apikeypost_data.errors.ibmxforce ? this.ibmxforcekeyError = this.Apikeypost_data.errors.ibmxforce : null;
              this.Apikeypost_data.errors.ibmxforce ? this.ibmxforcepassError = this.Apikeypost_data.errors.ibmxforce : null;
              this.Apikeypost_data.errors.virustotal ? this.virustotalError = this.Apikeypost_data.errors.virustotal : null;
              this.Apikeypost_data.errors.alienvault ? this.alienvaultkeyError = this.Apikeypost_data.errors.alienvault : null;
          }
        });
      }
    })

  }
  }
  goBack() {
    this._location.back();
  }
  clearForm(){
    this._location.back();
  }
  removeError(value){
    if((value === 'ibmxforcekeyError' || value === 'ibmxforcepassError') && (this.ibmxforcekeyError !== null || this.ibmxforcepassError !== null)){
      this.ibmxforcekeyError = null;
      this.ibmxforcepassError = null;
    }
    if(value === 'virustotalError' && this.virustotalError !== null){
      this.virustotalError = null
    }
    if(value === 'alienvaultkeyError' && this.alienvaultkeyError !== null){
      this.alienvaultkeyError = null
    }
  }
}
