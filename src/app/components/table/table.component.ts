import { Component, OnInit } from '@angular/core';
import { TableService } from 'src/app/services/table/table.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  //Definitions
  //Table & requests
  countryList: any = ['Cameroon', 'Ethiopia', 'Morocco', 'Mozambique', 'Uganda', 'unknown'];
  stateList: any = ['valid', 'notValid'];
  phonesList: any = null;
  state = '';
  country = '';
  //Pagination
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 'All'];
  from = 0;
  to = 0;

  //Forms
  form = new FormGroup({
    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required)
  });

  //errors
  errPhonesList : any = null;
  errAuth: any = null;

  constructor(private TableService: TableService) { }

  ngOnInit() {
    this.retrievePhonesList();
  }

  submit(){
    this.state = this.form.value.state;
    this.country = this.form.value.country;
    this.page = 1;
    this.retrievePhonesList();
  }

  getRequestParams(page: number, pageSize: number) {
    let params: any = {};
    if ((this.state)&&(this.state!='---')) {
      params[`state`] = this.state;
    }
    if ((this.country)&&(this.country!='---')) {
      params[`country`] = this.country;
    }
    if (pageSize) {
      params[`next`] = pageSize;
    }
    if (page) {
      params[`offset`] = pageSize*(page - 1);
    }
    return params;
  }

  retrievePhonesList() {
    const params = this.getRequestParams(this.page, this.pageSize);
    this.errPhonesList = null; this.errAuth = null;
    this.phonesList = null;
    this.TableService.getCustomerPhones(params).subscribe(response => {
      this.phonesList = response;
      this.count = response[0]?.total;
      this.to = this.page*this.pageSize;
      this.count == 0 ? (this.from = 0) : (this.from = (this.pageSize*(this.page - 1))+1);
      this.to >= this.count ? (this.to = this.count) : null;
    },
    error => {
      if(error.message=='Not Authorized'){
        this.errAuth = 'error';
      } else {
        this.errPhonesList = error?.message || error?.statusText || error;;
      }
    });
  }
  
  handlePageChange(event: any) {
    this.page = event;
    this.retrievePhonesList();
  }

  handlePageSizeChange(event: any) {
    event.target.value === 'All' ? (this.pageSize = this.count) : (this.pageSize = event.target.value);
    this.page = 1;
    this.retrievePhonesList();
  }

}
