'use strict';
/**
 * Write your transction processor functions here
 */
var NS = 'org.global.citizens.net';
/**
 * createProjectPledge
 * @param {org.global.citizens.net.CreateProjectPledge} createProjectPledge
 * @transaction
 */
function createProjectPledge(txParams) {
  if(!txParams.name || (txParams.name && txParams.name === "")) {
    throw new Error('Invalid Pledge Name!!');
  }
  if(!txParams.charity) {
    throw new Error('Invalid Charity!!');
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
    pledge.charity = txParams.aidOrg;
    return registry.add(pledge);
  }).then(function () {
    return getParticipantRegistry(NS + '.Charity');
  }).then(function (charityRegistry) {
    // save the buyer
    txParams.charity.projectPledge.push(pledge);
    return charityRegistry.update(txParams.charity);
  });
}
/**
 * SendPledgeToGlobalCitizen
 * @param {org.global.citizens.net.SendPledgeToGlobalCitizen} sendPledgeToGlobalCitizen
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
 * SendPledgeToMonetaryfound
 * @param {org.global.citizens.net.SendPledgeToMonetaryfound} sendPledgeToMonetaryfoundId
 * @transaction
 */
function sendPledgeToMonetaryfoundId(txParams) {
  if(!txParams.pledgeId || !txParams.monetaryfound || (txParams.monetaryfound && txParams.monetaryfound.length === 0)) {
    throw new Error('Invalid input parameters!!');
  }
  var factory = getFactory();
  txParams.pledgeId.status = 'GOVORGREVIEW';
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    return registry.update(txParams.pledgeId);
  }).then(function () {
    return getParticipantRegistry(NS + '.Monetaryfound');
  }).then(function (registry) {
    for(var i = 0; i < txParams.monetaryfound.length; i++) {
      txParams.monetaryfound[i].projectPledge.push(txParams.pledgeId);
    }
    return registry.updateAll(txParams.Monetaryfound);
  });
}
/**
 * UpdatePledge
 * @param {org.global.citizens.net.UpdatePledge} updatePledge
 * @transaction
 */
function updatePledge(txParams) {
  if(!txParams.monetaryfoundId) {
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
  funding.govOrgId = txParams.govOrgId;
  txParams.pledgeId.status = 'PROPOSALFUNDED';
  txParams.pledgeId.funds.push(funding);
  txParams.govOrgId.fundedPledges.push(txParams.pledgeId);
  return getAssetRegistry(NS + '.ProjectPledge').then(function (registry) {
    return registry.update(txParams.pledgeId);
  }).then(function () {
    return getParticipantRegistry(NS + '.Monetaryfound');
  }).then(function (registry) {
    return registry.update(txParams.monetaryfoundId);
  });
}
/**
 * TransferFunds
 * @param {org.global.citizens.net.TransferFunds} transferFunds
 * @transaction
 */
function transferFunds(txParams) {
  if(!txParams.pledgeId || !txParams.monetaryfoundId) {
    throw new Error('Invalid input parameters!!');
  }
  var factory = getFactory();
  var valid = false;
  for(var i = 0; i < txParams.monetaryfoundId.fundedPledges.length; i++) {
    if(txParams.monetaryfoundId.fundedPledges[i].pledgeId === txParams.pledgeId.pledgeId) {
      valid = true;
      break;
    }
  }
  if(!valid) {
    throw new Error('Pledge not funded!!');
  }
  for(var i = 0; i < txParams.pledgeId.funds.length; i++) {
    if(txParams.pledgeId.funds[i].monetaryfoundId === txParams.monetaryfoundId) {
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
