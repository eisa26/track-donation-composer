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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ProjectPledgeComponent } from './ProjectPledge/ProjectPledge.component';

import { GovOrgComponent } from './GovOrg/GovOrg.component';
import { AidOrgComponent } from './AidOrg/AidOrg.component';
import { GlobalCitizenComponent } from './GlobalCitizen/GlobalCitizen.component';

import { CreateProjectPledgeComponent } from './CreateProjectPledge/CreateProjectPledge.component';
import { SendPledgeToGlobalCitizenComponent } from './SendPledgeToGlobalCitizen/SendPledgeToGlobalCitizen.component';
import { SendPledgeToGovOrgComponent } from './SendPledgeToGovOrg/SendPledgeToGovOrg.component';
import { UpdatePledgeComponent } from './UpdatePledge/UpdatePledge.component';
import { TransferFundsComponent } from './TransferFunds/TransferFunds.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectPledgeComponent,
    GovOrgComponent,
    AidOrgComponent,
    GlobalCitizenComponent,
    CreateProjectPledgeComponent,
    SendPledgeToGlobalCitizenComponent,
    SendPledgeToGovOrgComponent,
    UpdatePledgeComponent,
    TransferFundsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
