/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectPledgeService } from './ProjectPledge.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-projectpledge',
  templateUrl: './ProjectPledge.component.html',
  styleUrls: ['./ProjectPledge.component.css'],
  providers: [ProjectPledgeService]
})
export class ProjectPledgeComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  pledgeId = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  decription = new FormControl('', Validators.required);
  fundsRequired = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  aidOrg = new FormControl('', Validators.required);
  funds = new FormControl('', Validators.required);

  constructor(public serviceProjectPledge: ProjectPledgeService, fb: FormBuilder) {
    this.myForm = fb.group({
      pledgeId: this.pledgeId,
      name: this.name,
      decription: this.decription,
      fundsRequired: this.fundsRequired,
      status: this.status,
      aidOrg: this.aidOrg,
      funds: this.funds
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceProjectPledge.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.global.citizens.net.ProjectPledge',
      'pledgeId': this.pledgeId.value,
      'name': this.name.value,
      'decription': this.decription.value,
      'fundsRequired': this.fundsRequired.value,
      'status': this.status.value,
      'aidOrg': this.aidOrg.value,
      'funds': this.funds.value
    };

    this.myForm.setValue({
      'pledgeId': null,
      'name': null,
      'decription': null,
      'fundsRequired': null,
      'status': null,
      'aidOrg': null,
      'funds': null
    });

    return this.serviceProjectPledge.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'pledgeId': null,
        'name': null,
        'decription': null,
        'fundsRequired': null,
        'status': null,
        'aidOrg': null,
        'funds': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.global.citizens.net.ProjectPledge',
      'name': this.name.value,
      'decription': this.decription.value,
      'fundsRequired': this.fundsRequired.value,
      'status': this.status.value,
      'aidOrg': this.aidOrg.value,
      'funds': this.funds.value
    };

    return this.serviceProjectPledge.updateAsset(form.get('pledgeId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceProjectPledge.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceProjectPledge.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'pledgeId': null,
        'name': null,
        'decription': null,
        'fundsRequired': null,
        'status': null,
        'aidOrg': null,
        'funds': null
      };

      if (result.pledgeId) {
        formObject.pledgeId = result.pledgeId;
      } else {
        formObject.pledgeId = null;
      }

      if (result.name) {
        formObject.name = result.name;
      } else {
        formObject.name = null;
      }

      if (result.decription) {
        formObject.decription = result.decription;
      } else {
        formObject.decription = null;
      }

      if (result.fundsRequired) {
        formObject.fundsRequired = result.fundsRequired;
      } else {
        formObject.fundsRequired = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
      }

      if (result.aidOrg) {
        formObject.aidOrg = result.aidOrg;
      } else {
        formObject.aidOrg = null;
      }

      if (result.funds) {
        formObject.funds = result.funds;
      } else {
        formObject.funds = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'pledgeId': null,
      'name': null,
      'decription': null,
      'fundsRequired': null,
      'status': null,
      'aidOrg': null,
      'funds': null
      });
  }

}
