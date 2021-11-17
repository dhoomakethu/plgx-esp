import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonapiService } from '../../../dashboard/_services/commonapi.service';
import { CommonVariableService } from '../../../dashboard/_services/commonvariable.service';
import { environment } from '../../../../environments/environment'
import * as $ from 'jquery';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import 'datatables.net';
import { Subject, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';



class log_data {
  line: string;
  message: string;
  severity: string;
  filename: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  public editorOptions: JsonEditorOptions;
  id: any;
  sub: any;
  product: any;
  nodes: any;
  node_id: any;
  network_info: any;
  hostDetails: any = {'osquery_version':'', 'extension_version':''};
  node_info: any;
  data: any;
  lastcheckin: any;
  currentdate: any;
  lastcheckindate: any;
  enrolled: any;
  enrolleddate: any;
  laststatus: any;
  laststatusdate: any;
  byte_value: number;
  physical_memory:any;
  lastresult: any;
  lastresultdate: any;
  lastconfig: any;
  lastconfigdate: any;
  lastqueryread: any;
  lastqueryreaddate: any;
  lastquerywrite: any;
  lastquerywritedate: any;
  networkheadeer: any;
  additionaldata: any;
  packs_count: any;
  pack_name: any;
  query_name: any;
  pack_query_name: any;
  query_name_value: any;
  query_count: any;
  querydata: any = [];
  pack_data:any = [];
  tags:any[];
  searchText:any;
  queryid:any;
  term:any;
  log_status:any;
  log_data:any;
  errorMessage:any;
  interval :any;
  dataRefresher: any;
  responce_action:Subscription;
  alerted_data_json:any;
  additional_config_data:any;
  status_log_checkbox=false;
  selectedItem:any;
  actionselect:any=0;
  host_identifier:any;
  os_platform:any;
  os_name:any;
  alertlist:any;
  alienvault = <any>{};
  ibmxforce = <any>{};
  rule = <any>{};
  virustotal = <any>{};
  public temp_var: Object=false;
    hosts_addtags_val:any;
    hosts_removetags_val:any;
    pack_addtags_val:any;
    pack_removetags_val:any;
    queries_addtags_val:any;
    queries_removetags_val:any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  ProjectName=this.commonvariable.APP_NAME
  constructor(
    private _Activatedroute: ActivatedRoute,
    private commonapi: CommonapiService,
    private commonvariable: CommonVariableService,
    private router: Router,
    private http: HttpClient,
    private _location: Location,
    private titleService: Title,

  ) { }
  toggle:boolean=false;

  ngOnInit() {
    this.titleService.setTitle(this.commonvariable.APP_NAME+"-"+"Hosts" );

    this.sub = this._Activatedroute.paramMap.subscribe(params => {
        this.id = params.get('id');
    localStorage.setItem('hostid', this.id);
    let products=this.commonapi.host_name_api(this.id).subscribe(res => {
    this.data = res;
    if(this.data.status == "failure"){
      this.pagenotfound();
    }
    else{
      if(this.data.data.id == this.id){
          this.nodes = this.data.data;
          this.node_id = this.nodes.id;
          this.network_info = this.nodes.network_info;
          this.host_identifier = this.nodes.host_identifier
          if(this.nodes.os_info != null){
          this.os_platform = this.nodes.os_info.platform;
          this.os_name = this.nodes.os_info.name;
          }
          this.hostDetails = this.nodes.host_details;
          this.node_info = this.nodes.node_info;
          this.physical_memory = this.physical_memory_formate(this.nodes.node_info.physical_memory);
          this.currentdate = new Date();

          if(!this.hostDetails){
            this.hostDetails={};
          }

          if(!this.hostDetails['osquery_version']){
            this.hostDetails['osquery_version'] = "-";
          }

          if(!this.hostDetails['extension_version']){
            this.hostDetails['extension_version'] = "-";
          }

          if(this.nodes.last_checkin==null){
            this.lastcheckin=''
          }else{
            this.lastcheckin = new Date(this.nodes.last_checkin);
          }


          if(this.nodes.enrolled_on==null){
            this.enrolled=''
          }else{
            this.enrolled = new Date(this.nodes.enrolled_on);
          }

          if(this.nodes.last_status==null){
            this.laststatus=''
          }else{
            this.laststatus = new Date(this.nodes.last_status);
          }

          if(this.nodes.last_result==null){
            this.lastresult=''
          }else{
            this.lastresult = new Date(this.nodes.last_result);
          }

          if(this.nodes.last_config==null){
            this.lastconfig=''
          }else{
            this.lastconfig = new Date(this.nodes.last_config);
          }


          if(this.nodes.last_query_read==null){
            this.lastqueryread=''
          }else{
            this.lastqueryread = new Date(this.nodes.last_query_read);
          }
          if(this.nodes.last_query_write==null){
            this.lastquerywrite=''
          }else{
            this.lastquerywrite = new Date(this.nodes.last_query_write);
          }
      }
    }


      });

      this.interval = setInterval(() => {
    //  if(this.titleService.getTitle() == this.commonvariable.APP_NAME+'-'+'Hosts'){
        this.refreshData();
    //  }
      }, 10000);
    // }

    let additional_config =this.commonapi.additional_config_api(this.id).subscribe(res =>{
        this.additionaldata=res;
        this.packs_count = Object.keys( this.additionaldata.data.packs ).length;
        this.pack_name = this.additionaldata.data.packs;
        this.query_count = Object.keys( this.additionaldata.data.queries ).length;
        this.query_name = this.additionaldata.data.queries;
        this.tags = this.additionaldata.data.tags;
        this.searchText;
        if(this.additionaldata.data.packs.length>0){
          this.getfirstpack_data();
        }

        if (this.additionaldata.data.queries.length>0){
          this.getfirst_data();
        }

    })
    })
    this.Host_Alerted_rules();
    }


    Host_Alerted_rules(){
     let host_id = localStorage.getItem('hostid');
     let alertedrules=this.commonapi.Host_rules_api(host_id).subscribe(res => {
      this.alertlist = res;
      if(this.alertlist.status == "success"){
        this.alienvault = this.alertlist.data.sources.alienvault;
        this.ibmxforce = this.alertlist.data.sources.ibmxforce;
        this.rule = this.alertlist.data.sources.rule;
        this.virustotal = this.alertlist.data.sources.virustotal;
        var rules = this.alertlist.data.rules;
        var rule_name = []
        var rule_count = [];
        for(const i in rules){
          rule_name.push(rules[i].name)
          rule_count.push(rules[i].count)
        }
        if(rule_name.length==0){
          $('.top_rules').hide();
          $(document.getElementById('no-data-bar-chart-top_5_alerted_rules')).append("No Rules Based Alerts");
       }else{
        this.load_top_rules_graph(rule_name,rule_count)
       }
      }

    });
    }

    load_top_rules_graph(rule_name,rule_count){
      var myChartsdaklns = new Chart('alerted_rules', {
        type: 'bar',
        data: {
            labels:rule_name,
            datasets: [{
                data: rule_count,
                backgroundColor: [
                  "#2A6D7C",
                  "#A2D9C5",
                  "#F79750",
                  "#794F5D",
                  "#6EB8EC"
              ],
                barPercentage: 0.5,
            }]
        },
        options: {
          tooltips:{
            intersect : false,
            mode:'index'
            },
            responsive: false,
          // maintainAspectRatio: false,
          legend: {
            display: false
          },
          plugins: {
            labels: {
              render: () => {}
            }
          },
          scales: {
            offset:false,
            xAxes: [{
              barThickness: 30,
              gridLines: {
                  offsetGridLines: true,
                  display : false,
              },
              ticks: {
                callback: function(label, index, labels) {
                  var res = label.substring(0,2)+"..";
                  return res;
                },
                minRotation: 45
              }
          }],
          yAxes: [{
            ticks: {
                beginAtZero: true,
                display: false,
            },
            gridLines: {
              drawBorder: false,
          }
        }]
          },
        }
         });

         //ctx.myChartsdaklns = 230;
    }


close() {
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
  this.actionselect = 0;
}

    showdata(n){

      this.commonapi.view_config_api(this.id).subscribe(res =>{
      this.additional_config_data =res;
      this.toggle=false;
      setTimeout(()=>{
        this.editorOptions = new JsonEditorOptions();
        this.editorOptions.mode = 'view';
        this.alerted_data_json=this.additional_config_data.data;
        this.toggle=true;
      }, 100);
    })
    }

    /*
    This function convert bytes into  system physical_memory format -- Start
    */
    physical_memory_formate(bytes){
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0)
        return '0 Byte';
    this.byte_value = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, this.byte_value)) + ' ' + sizes[this.byte_value];
    }
    /*
    This function convert bytes into  system physical_memory format -- End
    */
    refreshData(){
        let products=this.commonapi.host_name_api(this.id).subscribe(res => {
          this.data = res;
          if(this.data.data.id == this.id){
              this.nodes = this.data.data;
              this.node_id = this.nodes.id;
              this.network_info = this.nodes.network_info;
              this.node_info = this.nodes.node_info;
              this.currentdate = new Date();
              if(this.nodes.last_checkin==null){
                this.lastcheckin=''
              }else{
                this.lastcheckin = new Date(this.nodes.last_checkin);
              }
              if(this.nodes.enrolled_on==null){
                this.enrolled=''
              }else{
                this.enrolled = new Date(this.nodes.enrolled_on);
              }

              if(this.nodes.last_status==null){
                this.laststatus=''
              }else{
                this.laststatus = new Date(this.nodes.last_status);
              }

              if(this.nodes.last_result==null){
                this.lastresult=''
              }else{
                this.lastresult = new Date(this.nodes.last_result);
              }

              if(this.nodes.last_config==null){
                this.lastconfig=''
              }else{
                this.lastconfig = new Date(this.nodes.last_config);
              }


              if(this.nodes.last_query_read==null){
                this.lastqueryread=''
              }else{
                this.lastqueryread = new Date(this.nodes.last_query_read);
              }
              if(this.nodes.last_query_write==null){
                this.lastquerywrite=''
              }else{
                this.lastquerywrite = new Date(this.nodes.last_query_write);
              }
          }
        })
        //Passing the false flag would prevent page reset to 1 and hinder user interaction

    }
    ngOnDestroy() {
        clearInterval(this.interval)
        window.clearInterval(this.interval);

      }

  getBy_packId(pack_name) {
    this.selectedItem=pack_name
    for (const i in this.additionaldata.data.packs) {
      if (this.additionaldata.data.packs[i].name == pack_name) {
        this.pack_data = this.additionaldata.data.packs[i]
      }
    }
  }
  getfirstpack_data() {
    this.pack_data = this.additionaldata.data.packs[0];
    this.selectedItem=this.pack_data.name
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  getById(queryId) {
    for (const i in this.additionaldata.data.queries) {
      if (this.additionaldata.data.queries[i].id == queryId) {
        this.querydata = this.additionaldata.data.queries[i]
        this.queryid = queryId
      }
    }
  }
  getfirst_data() {
    this.querydata = this.additionaldata.data.queries[0];
    this.queryid = this.querydata.id
  }

  runAdHoc(queryId) {
    this.router.navigate(['live-queries/', queryId]);
  }

  redirect(pack) {
    this.router.navigate(['/tag']);
  }

  hosts_addTag(tags, node_id) {
    this.commonapi.hosts_addtag_api(node_id, tags.toString()).subscribe(res => {
      this.hosts_addtags_val = res;
    });
  }
  hosts_removeTag(event, node_id) {
    this.commonapi.hosts_removetags_api(node_id, event).subscribe(res => {
      this.hosts_removetags_val = res;
    });

  }

  pack_addTag(test, id) {
    this.commonapi.packs_addtag_api(id, test.toString()).subscribe(res => {
      this.pack_addtags_val = res;

    });
  }
  pack_removeTag(pack_id,event) {
    this.commonapi.packs_removetags_api(event, pack_id).subscribe(res => {
      this.pack_removetags_val = res;
    });

  }
  queries_addTag(tags, query_id) {
    this.commonapi.queries_addtag_api(query_id, tags.toString()).subscribe(res => {
      this.queries_addtags_val = res;

    });
  }
  queries_removeTag(event, query_id) {
    this.commonapi.queries_removetags_api(query_id, event).subscribe(res => {
      this.queries_removetags_val = res;
    });
  }

  goBack() {
    this._location.back();
  }
  get_status_log_data(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching: true,
      "language": {
        "search": "Search: "
      },
      ajax: (dataTablesParameters: any, callback) => {
        var body = dataTablesParameters;
        body['limit']=body['length'];
        if(body.search.value!= ""  &&  body.search.value.length>=3)
      {

        body['searchterm']=body.search.value;

      }
      if(body.search.value!="" && body.search.value.length<3)
      {
         return;
      }

        let host_id = localStorage.getItem('hostid');
        var body = dataTablesParameters;
        body['limit'] = body['length'];
        body['node_id'] = host_id;


        this.http.post<DataTablesResponse>(environment.api_url+"/hosts/status_logs", body, { headers: { 'Content-Type': 'application/json','x-access-token': localStorage.getItem('JWTkey')}}).subscribe(res =>{
          this.log_status = res;
          this.log_data = this.log_status.data.results;

          if(this.log_data.length >0 &&  this.log_data!=undefined)
          {

            // $("#DataTables_Table_0_info").
            $('.dataTables_paginate').show();
            $('.dataTables_info').show();


          }
          else{
            if(body.search.value=="" || body.search.value == undefined)
            {
              this.errorMessage="No Data Found";
            }
            else{
              this.errorMessage="No Matching Record Found";
            }

            $('.dataTables_paginate').hide();
            $('.dataTables_info').hide();
          }

          callback({
            recordsTotal: this.log_status.data.count,
            recordsFiltered: this.log_status.data.count,
            data: []
          });
        });
      },
      ordering: false,
      columns: [{ data: 'line' }, { data: 'message' }, { data: 'severity' }, { data: 'filename' },{ data: 'created' },{ data: 'version' }]
    }
  }
  status_log_tab(){
    this.status_log_checkbox = false;
  }
  toggleEditable(event) {
    if ( event.target.checked ) {
      this.status_log_checkbox = true;
      this.get_status_log_data()
    }else{
      this.status_log_checkbox = false;
    }
  }

  onselectoption(value){
    if(value == 1){
     let modal = document.getElementById("myModal");
     modal.style.display = "block";
     this.showdata(undefined);
    }
   }
  pagenotfound() {
      this.router.navigate(['/pagenotfound']);
  }



}
