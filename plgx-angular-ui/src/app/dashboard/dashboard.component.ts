import { Component, OnInit } from '@angular/core';
import {CommonapiService} from './_services/commonapi.service';
import { first } from 'rxjs/operators';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { CommonVariableService } from '../dashboard/_services/commonvariable.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css','./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public dashboardData: any;
  distribution:any;
  query:any;
  host:any;
  hostcolumn:any;
  categorycolumn:any;
  rulescolumn:any;

  alienvault_critical:any;
  alienvault_warning:any;
  alienvault_low:any;
  alienvault_info:any;
  otx_counter:any;

  ibmxforce_critical:any;
  ibmxforce_warning:any;
  ibmxforce_low:any;
  ibmxforce_info:any;
  ibm_counter:any;

  rule_critical:any;
  rule_warning:any;
  rule_low:any;
  rule_info:any;
  rule_counter:any;
  placholder:any;

  virustotal_critical:any;
  virustotal_warning:any;
  virustotal_low:any;
  virustotal_info:any;
  vt_counter:any;
  cpt_down:any;
  route: string;
  currentURL='';
  purge_duration:any;
  ProjectName=this.commonvariable.APP_NAME
  constructor(
    private commonapi: CommonapiService,
    private commonvariable: CommonVariableService,
  ) {
   }

  ngOnInit() {
    this.placholder = '';
    this.commonapi.Dashboard().pipe(first()).subscribe((res: any) => {
        this.dashboardData = res;
        console.log(this.dashboardData.data.alert_data.source);
        this.purge_duration = res.data.purge_duration;
        this.alienvault_critical = this.dashboardData.data.alert_data.source.alienvault.CRITICAL;
        this.alienvault_warning = this.dashboardData.data.alert_data.source.alienvault.WARNING;
        this.alienvault_low = this.dashboardData.data.alert_data.source.alienvault.LOW;
        this.alienvault_info = this.dashboardData.data.alert_data.source.alienvault.INFO;
        this.otx_counter = this.dashboardData.data.alert_data.source.alienvault.TOTAL;
        if(this.otx_counter !==''){
        $('.otx_counter_val').show();
        $('.otx_counter_val2').show();
        $('.otx_counter_val3').hide();
        }
        //IBM X-IBMxForce
        this.ibmxforce_critical = this.dashboardData.data.alert_data.source.ibmxforce.CRITICAL;
        this.ibmxforce_warning = this.dashboardData.data.alert_data.source.ibmxforce.WARNING;
        this.ibmxforce_low = this.dashboardData.data.alert_data.source.ibmxforce.LOW;
        this.ibmxforce_info = this.dashboardData.data.alert_data.source.ibmxforce.INFO;
        this.ibm_counter = this.dashboardData.data.alert_data.source.ibmxforce.TOTAL;
        if(this.ibm_counter !==''){
          $('.ibm_counter_val').show();
        $('.ibm_counter_val2').show();
        $('.ibm_counter_val3').hide();
        }
        //rules
        this.rule_critical = this.dashboardData.data.alert_data.source.rule.CRITICAL;
        this.rule_warning = this.dashboardData.data.alert_data.source.rule.WARNING;
        this.rule_low = this.dashboardData.data.alert_data.source.rule.LOW;
        this.rule_info = this.dashboardData.data.alert_data.source.rule.INFO;
        this.rule_counter = this.dashboardData.data.alert_data.source.rule.TOTAL;
        if(this.rule_counter !==''){
          $('.rule_counter_val').show();
        $('.rule_counter_val2').show();
        $('.rule_counter_val3').hide();
        }
        //virus virustotal_warning
        this.virustotal_critical = this.dashboardData.data.alert_data.source.virustotal.CRITICAL;
        this.virustotal_warning = this.dashboardData.data.alert_data.source.virustotal.WARNING;
        this.virustotal_low = this.dashboardData.data.alert_data.source.virustotal.LOW;
        this.virustotal_info = this.dashboardData.data.alert_data.source.virustotal.INFO;
        this.vt_counter = this.dashboardData.data.alert_data.source.virustotal.TOTAL;
        console.log(this.vt_counter);
        if(this.vt_counter !==''){
          $('.vt_counter_val').show();
        $('.vt_counter_val2').show();
        $('.vt_counter_val3').hide();
        }

        if(this.otx_counter>0)
        {
        localStorage.setItem('alerts_name','alienvault');
        }
        else if(this.ibm_counter>0)
        {
        localStorage.setItem('alerts_name','ibmxforce');
        }
        else if(this.rule_counter>0)
        {
        localStorage.setItem('alerts_name','rule');
        }
        else{
        localStorage.setItem('alerts_name','virustotal');
        }
        this.distribution = this.dashboardData.data.distribution_and_status.hosts_platform_count;
        let distributionval = this.distribution;

        this.query = this.dashboardData.data.distribution_and_status.query;
        let queryval = this.query;

        this.host = this.dashboardData.data.distribution_and_status.hosts_status_count;
        let hostval = this.host;

        this.rulescolumn = this.dashboardData.data.alert_data.top_five.rule;
        let rulescolumnval = this.rulescolumn;

        this.categorycolumn = this.dashboardData.data.alert_data.top_five.query;
        let categorycolumnval = this.categorycolumn;

        this. hostcolumn = this.dashboardData.data.alert_data.top_five.hosts;
        let hostcolumnval = this.hostcolumn;


// Start Platform distribution chart
var platform_distibution = []
var platform_distibution_count=[]
var backgrund_colour=[]
for(const i in distributionval){
   platform_distibution.push(distributionval[i].os_name)
   platform_distibution_count.push(distributionval[i].count)
   if(distributionval[i].os_name=="windows"){
     backgrund_colour.push('#2A6D7C')
   }else if(distributionval[i].os_name=="darwin"){
     backgrund_colour.push('#F79750')
   }else{
     backgrund_colour.push('#A2D9C5')
   }
}
if(platform_distibution_count.length==0){
   $(document.getElementById('no-data-platform-distribution-chart')).append("No data");
   $('.no-data-platform-distribution').show();
} var myChart = new Chart('pie-chart-platform-distribution-chart', {
      type: 'pie',
      data: {
          labels: platform_distibution,
          datasets: [{
              data: platform_distibution_count,
              backgroundColor: backgrund_colour
          }]
      },
      options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: 'white',
          overlap: false,
        }
      },
        legend: {
          display: true,
          position: 'right',
          onClick: null ,
          labels: {
            fontColor: '#333',
            usePointStyle:true
        }
        },
      }
  });
// End Start Platform distribution chart

// Start host status chart

var Host_status_data = []
var Host_status_data_count=[]
var backgrund_colour=[]
for(const i in hostval){
  if(i=="online"){
    if(hostval.online !==0){
  Host_status_data.push("online")    
  Host_status_data_count.push(hostval[i])
  backgrund_colour.push('#96E6C9')
}
  }else{
    if(hostval.offline !==0){
    Host_status_data.push("offline")    
    Host_status_data_count.push(hostval[i])
    backgrund_colour.push("#FF8080")
  }
  }
}
if(Host_status_data_count.length==0 ){
   $(document.getElementById('no-data-pie-Host-status-result-chart')).append("No data");
   $('.pie-chart-Host-status').show();
   $('.pie-chart-Host-canvas').hide(); 
}
 var myChart1 = new Chart('pie-chart-Host-status-pie-chart', {       
      type: 'pie',
      data: {
          labels: Host_status_data,
          datasets: [{
              data: Host_status_data_count,
              backgroundColor: backgrund_colour
          }]
      },
      options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: 'white',
          overlap: false,
        }
      },
        legend: {
          display: true,
          position: 'right',
          onClick: null ,
          labels: {
            fontColor: '#333',
            usePointStyle:true
        }
        },
      }
  });
// End host status chart
// Start top 5 alerted hosts
var top_5hosts = []
var top_5hosts_count=[]
for(const i in hostcolumnval){
  top_5hosts.push(hostcolumnval[i].host_identifier)
  top_5hosts_count.push(hostcolumnval[i].count)
}
if(top_5hosts_count.length==0){
   $(document.getElementById('no-data-bar-chart-top_5_alerted_hosts')).append("No data");
   $('.alerted_hosts').hide();
}

var myChart1 = new Chart('bar-chart-top_5_alerted_hosts', {
  type: 'bar',
  data: {
      labels:top_5hosts,
      datasets: [{
          data: top_5hosts_count,
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
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    plugins: {
      labels: {
        render: () => {}
      }
    },
    scales: {
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
  },

  });
// End top 5 alerted hosts
// Start top 5 alerted categories
var top_5_categories = []
var top_5_categories_count=[]
for(const i in categorycolumnval){
  top_5_categories.push(categorycolumnval[i].query_name)
  top_5_categories_count.push(categorycolumnval[i].count)
}
if(top_5_categories_count.length==0){
   $(document.getElementById('no-data-bar-chart-top_5_alerted_categries')).append("No data");
   $('.categories_data').hide();
}

var myChart1 = new Chart('bar-chart-top_5_alerted_categries', {
  type: 'bar',
  data: {
      labels:top_5_categories,
      datasets: [{
          data: top_5_categories_count,
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
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    plugins: {
      labels: {
        render: () => {}
      }
    },
    scales: {
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
  },
  });
// End top 5 alerted categories
// Start top 5 alerted rules
var top_5_rules = []
var top_5_rules_count=[]
for(const i in rulescolumnval){
  top_5_rules.push(rulescolumnval[i].rule_name)
  top_5_rules_count.push(rulescolumnval[i].count)
}
if(top_5_rules_count.length==0){
   $(document.getElementById('no-data-bar-chart-top_5_alerted_rules')).append("No data");
   $('.top_rules').hide();
}

var myChart1 = new Chart('bar-chart-top_5_alerted_rules', {
  type: 'bar',
  data: {
      labels:top_5_rules,
      datasets: [{
          data: top_5_rules_count,
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
      responsive: true,
    maintainAspectRatio: false,
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
  },
  });
      }
    );
  }



  downloadFile(e,val){
    this.currentURL = window.location.href;
    let toArray = this.currentURL.split(':');
    this.cpt_down = toArray[0] + ":" + toArray[1] + ":9000/downloads/" + val;
    window.open(this.cpt_down);
    }

}
