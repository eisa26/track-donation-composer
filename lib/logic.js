'use strict';
/**
 * Write your transction processor functions here
 */
var NS = 'org.block.track.net';
/**
 * createProjectPledge
 * @param {org.block.track.net.CreateProjectPledge} createProjectPledge
 * @transaction
 */
function createProjectPledge(txParams) {
  if(!txParams.name || (txParams.name && txParams.name === "")) {
    throw new Error('Invalid Pledge Name!!');
  }
  if(!txParams.Charity) {
    throw new Error('Charity!!');
  }
  var factory = getFactory();
  var pledge = null;
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    pledge = factory.newResource(NS, 'ProjectPledge', txParams.pledgeId);
    pledge.name = txParams.name;
    pledge.decription = txParams.decription;
    pledge.fundsRequired = txParams.fundsRequired;
    pledge.status = 'INITIALSTATE';
    pledge.funds = [];
    pledge.Charity = txParams.Charity;
    return registry.add(pledge);
  }).then(function () {
    return getParticipantRegistry(NS + '.Charity');
  }).then(function (CharityRegistry) {
    // save the buyer
    txParams.Charity.projectPledge.push(pledge);
    return CharityRegistry.update(txParams.Charity);
  });
}
/**
 * SendPledgeToGlobalCitizen
 * @param {org.block.track.net.SendPledgeToGlobalCitizen} sendPledgeToGlobalCitizen
 * @transaction
 */
function sendPledgeToGlobalCitizen(txParams) {
  if(!txParams.citizenId || !txParams.pledgeId) {
    throw new Error('Invalid input parameters!!');
  }
  txParams.pledgeId.status = 'GLOBALCITIZENREVIEW';
  txParams.citizenId.projectPledge.push(txParams.pledgeId);
  var factory = getFactory();
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    return registry.update(txParams.pledgeId);
  }).then(function () {
    return getParticipantRegistry(NS + '.GlobalCitizen');
  }).then(function (registry) {
    return registry.update(txParams.citizenId);
  });
}
/**
 * SendPledgeToMonFund
 * @param {org.block.track.net.SendPledgeToMonFund} sendPledgeToMonFund
 * @transaction
 */
function sendPledgeToMonFund(txParams) {
  if(!txParams.pledgeId || !txParams.MonFund || (txParams.MonFund && txParams.MonFund.length === 0)) {
    throw new Error('Invalid input parameters!!');
  }
  var factory = getFactory();
  txParams.pledgeId.status = 'MonFundREVIEW';
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    return registry.update(txParams.pledgeId);
  }).then(function () {
    return getParticipantRegistry(NS + '.MonFund');
  }).then(function (registry) {
    for(var i = 0; i < txParams.MonFund.length; i++) {
      txParams.MonFund[i].projectPledge.push(txParams.pledgeId);
    }
    return registry.updateAll(txParams.MonFund);
  });
}
/**
 * UpdatePledge
 * @param {org.block.track.net.UpdatePledge} updatePledge
 * @transaction
 */
function updatePledge(txParams) {
  if(!txParams.MonFundId) {
    throw new Error('Invalid user type!!');
  }
  var factory = getFactory();
  var funding = factory.newConcept(NS, 'Funding');
  var daysToAdd = 0;
  switch(txParams.fundingType) {
  case 'WEEKLY':
    daysToAdd = 7;
    break;
  case 'MONTHLY':
    daysToAdd = 30;
    break;
  case 'SEMIANNUALY':
    daysToAdd = 180;
    break;
  case 'ANNUALY':
    daysToAdd = 365;
    break;
  }
  funding.fundingType = txParams.fundingType;
  funding.nextFundingDueInDays = daysToAdd;
  funding.approvedFunding = txParams.approvedFunding;
  funding.totalFundsReceived = 0;
  funding.fundsPerInstallment = txParams.fundsPerInstallment;
  funding.MonFundId = txParams.MonFundId;
  txParams.pledgeId.status = 'PROPOSALFUNDED';
  txParams.pledgeId.funds.push(funding);
  txParams.MonFundId.fundedPledges.push(txParams.pledgeId);
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    return registry.update(txParams.pledgeId);
  }).then(function () {
    return getParticipantRegistry(NS + '.MonFund');
  }).then(function (registry) {
    return registry.update(txParams.MonFundId);
  });
}
/**
 * SendMoneyToMonFund
 * @param {org.block.track.net.SendMoneyToMonFund} SendMoneyToMonFund
 * @transaction
 */

function SendMoneyToMonFund(txParams) {
   if(!txParams.MonFundId || !txParams.MId) {
    throw new Error('Invalid input parameters!!');
  }
  var factory = getFactory();
  return getAssetRegistry(NS + '.SendMoney').then(function (registry) {
    return registry.update(txParams.MId);
  }).then(function () {
    return getParticipantRegistry(NS + '.MonFund');
  }).then(function (registry) {
    return registry.update(txParams.MonFundId);
  });
}
/**
 * TransferFunds
 * @param {org.block.track.net.TransferFunds} transferFunds
 * @transaction
 */
function transferFunds(txParams) {
  if(!txParams.pledgeId || !txParams.MonFundId) {
    throw new Error('Invalid input parameters!!');
  }
  var factory = getFactory();
  var valid = false;
  for(var i = 0; i < txParams.MonFundId.fundedPledges.length; i++) {
    if(txParams.MonFundId.fundedPledges[i].pledgeId === txParams.pledgeId.pledgeId) {
      valid = true;
      break;
    }
  }
  if(!valid) {
    throw new Error('Pledge not funded!!');
  }
  for(var i = 0; i < txParams.pledgeId.funds.length; i++) {
    if(txParams.pledgeId.funds[i].MonFundId === txParams.MonFundId) {
      var daysToAdd = 0;
      switch(txParams.pledgeId.funds[i].fundingType) {
      case 'WEEKLY':
        daysToAdd = 7;
        break;
      case 'MONTHLY':
        daysToAdd = 30;
        break;
      case 'SEMIANNUALY':
        daysToAdd = 180;
        break;
      case 'ANNUALY':
        daysToAdd = 365;
        break;
      }      
      txParams.pledgeId.funds[i].nextFundingDueInDays = daysToAdd;
      txParams.pledgeId.funds[i].totalFundsReceived += txParams.pledgeId.funds[i].fundsPerInstallment;
      break;
    }
  }
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    return registry.update(txParams.pledgeId);
  });
}