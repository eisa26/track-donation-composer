import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.global.citizens.net{
   export enum Status {
      INITIALSTATE,
      GLOBALCITIZENREVIEW,
      GOVORGREVIEW,
      PROPOSALFUNDED,
   }
   export enum FundingType {
      WEEKLY,
      MONTHLY,
      SEMIANNUALY,
      ANNUALY,
   }
   export enum FundingStatus {
      COMPLETE,
      INCOMPLETE,
   }
   export enum MessageStatus {
      NOTREVIEWED,
      REVIEWED,
   }
   export class Funding {
      fundingType: FundingType;
      nextFundingDueInDays: number;
      approvedFunding: number;
      totalFundsReceived: number;
      fundsPerInstallment: number;
      govOrgId: GovOrg;
   }
   export class ProjectPledge extends Asset {
      pledgeId: string;
      name: string;
      decription: string;
      fundsRequired: number;
      status: Status;
      aidOrg: AidOrg;
      funds: Funding[];
   }
   export abstract class User extends Participant {
      projectPledge: ProjectPledge[];
   }
   export class GovOrg extends User {
      govOrgId: string;
      fundedPledges: ProjectPledge[];
   }
   export class AidOrg extends User {
      aidOrgId: string;
   }
   export class GlobalCitizen extends User {
      citizenId: string;
   }
   export class CreateProjectPledge extends Transaction {
      pledgeId: string;
      name: string;
      decription: string;
      fundsRequired: number;
      aidOrg: AidOrg;
   }
   export class SendPledgeToGlobalCitizen extends Transaction {
      citizenId: GlobalCitizen;
      pledgeId: ProjectPledge;
   }
   export class SendPledgeToGovOrg extends Transaction {
      govOrg: GovOrg[];
      pledgeId: ProjectPledge;
   }
   export class UpdatePledge extends Transaction {
      govOrgId: GovOrg;
      pledgeId: ProjectPledge;
      fundingType: FundingType;
      approvedFunding: number;
      fundsPerInstallment: number;
   }
   export class TransferFunds extends Transaction {
      govOrgId: GovOrg;
      pledgeId: ProjectPledge;
   }
// }
