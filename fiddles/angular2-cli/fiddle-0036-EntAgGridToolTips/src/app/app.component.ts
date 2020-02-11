import { Component, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { AllModules } from '@ag-grid-enterprise/all-modules';

function cell(text: any, styleId: any = null) {
  return {
    styleId: styleId,
    data: {
      type: /^\d+$/.test(text) ? 'Number' : 'String',
      value: String(text)
    }
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gridApi;
  gridColumnApi;
  modules: any[] = AllModules;
  columnDefs: any;
  detailCellRendererParams: any;
  rowData: any;
  keepDetailRowsCount = 2;
  defaultExportParams: any;
  defaultColDef: any;
  excelStyles: any;
  ifInstructions = true;
  frameworkComponents: any;

  constructor(private http: Http) {

    this.columnDefs = [{
        field: 'name',
        cellRenderer: 'agGroupCellRenderer',
        cellClass: 'body',
        tooltipField: 'name',
        tooltipComponentParams: {
          tooltip: 'Customer\'s Name'
        }
      },
      {
        field: 'account',
        cellClass: 'body',
        tooltipField: 'account',
        tooltipComponentParams: {
          tooltip: 'Customer\'s Account Number'
        }
      },
      {
        field: 'calls',
        cellClass: 'body',
        tooltipField: 'calls',
        tooltipComponentParams: {
          tooltip: 'Total Calls involving this Customer'
        }
      },
      {
        field: 'minutes',
        valueFormatter: 'x.toLocaleString() + "m"',
        cellClass: 'bodyFloat',
        tooltipField: 'minutes',
        tooltipComponentParams: {
          tooltip: 'Duration of all Calls for this customer'
        }
      },
      {
        field: 'Comment',
        cellClass: 'body'
      },
      {
        field: 'rating',
        cellClass: 'body',
        tooltipField: 'rating',
        tooltipComponentParams: {
          tooltip: 'customer\'s rating'
        }
      }
    ];

    this.defaultColDef = {
      filter: true,
      resizable: true,
      sortable: true,
      tooltipComponent: 'fiddleTooltipComponent'
    };

    this.frameworkComponents = {
      fiddleTooltipComponent: TooltipComponent
    };

    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [{
            field: 'callId',
            tooltipField: 'callId',
            tooltipComponentParams: {
              tooltip: 'Id used to Identify the Call'
            }
          },
          {
            field: 'direction',
            tooltipField: 'direction',
            tooltipComponentParams: {
              tooltip: 'Inbound or Outbound Call'
            }
          },
          {
            field: 'number',
            tooltipField: 'number',
            tooltipComponentParams: {
              tooltip: 'The Caller\'s Phone Number'
            }
          },
          {
            field: 'duration',
            tooltipField: 'duration',
            valueFormatter: 'x.toLocaleString() + "s"',
            tooltipComponentParams: {
              tooltip: 'Length of all Call'
            }
          },
          {
            field: 'switchCode',
            tooltipField: 'switchCode',
            tooltipComponentParams: {
              tooltip: 'Switch Board Indicator'
            }
          }
        ],
        defaultColDef: {
          filter: true,
          resizable: true,
          sortable: true,
          tooltipComponent: 'fiddleTooltipComponent'
        },
        frameworkComponents: {
          fiddleTooltipComponent: TooltipComponent
        },
        onFirstDataRendered: (params) => {
          this.autoSizeAllColumns(params);
        }
      },
      getDetailRowData: (params) => {
        setTimeout(() => {
          params.successCallback(params.data.callRecords);
        }, 2000);
      },
      template: '<div style="height: 100%; background-color: var(--blue6); padding: 10px;">' +
        '  <div ref="eDetailGrid" style="height: 100%;"></div>' +
        '</div>',
      sheetName: 'EntAgGridHierarchicalExport',
      fileName: 'fiddle-0035',
      columnWidth: '20'
    };
   
    this.defaultExportParams = {
      getCustomContentBelowRow: (params: any) => {
        if (params.node.data.callRecords && params.node.data.callRecords.length) {
          return [
            [
              cell(''),
              cell('callId', 'header'),
              cell('direction', 'header'),
              cell('number', 'header'),
              cell('duration', 'header'),
              cell('switchCode', 'header')
            ]
          ].concat(
            params.node.data.callRecords.map((record: any) => {
              return [
                cell(''),
                cell(record.callId, 'body'),
                cell(record.direction, 'body'),
                cell(record.number, 'body'),
                cell(record.duration, 'body'),
                cell(record.switchCode, 'body')
              ];
            }),
            [
              []
            ]
          );
        }
        return false;
      }
    };

    this.excelStyles = [{
        id: 'header',
        interior: {
          color: '#007BFF',
          pattern: 'Solid'
        },
        font: {
          color: '#FFFFFF'
        },
        alignment: {
          horizontal: 'Left',
          vertical: 'Middle'
        }

      },
      {
        id: 'headerNum',
        interior: {
          color: '#007BFF',
          pattern: 'Solid'
        },
        alignment: {
          horizontal: 'Right',
          vertical: 'Middle'
        }
      },
      {
        id: 'body',
        interior: {
          color: '#ebf9ff',
          pattern: 'DiagCross'
        }
      },
      {
        id: 'bodyInt',
        interior: {
          color: '#ebf9ff',
          pattern: 'Solid'
        },
        numberFormat: {
          format: '#,##0_);[Red](#,##0)'
        },
        alignment: {
          horizontal: 'Right',
          vertical: 'Middle'
        }
      },
      {
        id: 'bodyFloat',
        numberFormat: {
          format: '0.00'
        },
        interior: {
          color: '#ebf9ff',
          pattern: 'Solid'
        },
        alignment: {
          horizontal: 'Right',
          vertical: 'Middle'
        }
      },

    ];

  }

  onFirstDataRendered(params) {
    this.autoSizeAllColumns(params);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/simple/data/data.json'
      )
      .map((res: Response) => res.json())
      .subscribe(data => {
        console.log(typeof data);
        this.rowData = data;
      });

    setTimeout(() => {
      this.ifInstructions = false;
    }, 3000);
  }

  private autoSizeAllColumns(params: any): void {
    const allColumnIds: any[] = [];
    params.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }
}