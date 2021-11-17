import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonapiService } from '../../dashboard/_services/commonapi.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { CommonVariableService } from '../../dashboard/_services/commonvariable.service';
import { Location } from '@angular/common';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
// import '../../../js/live_query_bundle.js'
@Component({
  selector: 'app-ioc',
  templateUrl: './ioc.component.html',
  styleUrls: ['./ioc.component.css']
})

export class IocComponent implements OnInit {
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  options = new JsonEditorOptions();
  ioc_val: any;
  public data = {};
  loading = false;
  submitted = false;
  Updated: any;
  public result: any;
  error: any;
  public json_data: any = {};
  ProjectName=this.commonvariable.APP_NAME
  constructor(
    private commonapi: CommonapiService,
    private _location: Location,
    private commonvariable: CommonVariableService,
  ) {
    this.options.mode = 'code';
    this.options.modes = ['code', 'text', 'tree', 'view'];
    this.options.onChange = () => this.json_data['data'] = this.editor.get()
  }
  toggle: boolean = false;

  ngOnInit() {

    this.toggle = false;
    setTimeout(()=>{
    this.commonapi.ioc_api().subscribe(res => {
      this.ioc_val = res;
      this.editorOptions = new JsonEditorOptions();
      this.editorOptions.mode = 'code';
      this.editorOptions.modes = ['code','text', 'tree', 'view'];
      this.data = this.ioc_val.data;
      this.json_data['data'] = this.data;
      this.toggle = true;
    });

    }, 100);
  }

  public setTreeMode() {
    this.editor.setMode('tree');
  }

  onSubmit() {
    if(Object.entries(this.json_data.data).length==0){

      swal({
      icon: 'warning',
      title: 'failure',
      text: "please upload the correct json",
      buttons: [false],
      timer: 2000,
      })
      return ;
      } else{
    this.commonapi.ioc_update_api(this.json_data).subscribe(res => {
      this.result = res;
      console.log("ioc_testing", this.result);
      if (this.result && this.result.status === 'failure') {
        swal({
          icon: 'warning',
          title: this.result.status,
          text: this.result.message,
        })
      } else {
        swal({
          icon: 'success',
          title: 'Success',
          text: this.result.message,
          buttons: [false],
          timer: 2000,
        })
        this.error = null;
        this.Updated = true;

      }
       setTimeout(() => {
        // location.reload();
        this.ngOnInit()
      },2000);
    },
      error => {
        console.log(error);
      }
    )
    }
    
  }
  goBack() {
    this._location.back();
  }

}
