const START_DATE = '2020-01-01';
const TOTAL_DAYS = 365;

// Applications are sorted on the basis of profit they can provide
function sort_by_profit(application_a, application_b){
  let profit_by_a = -application_a.principal;
  let profit_by_b = -application_b.principal;
  application_a.repayments.forEach((repayment) => profit_by_a+=repayment.amount );
  application_b.repayments.forEach((repayment) => profit_by_b+=repayment.amount );
  return profit_by_b - profit_by_a;
}

// Day difference implies the number of days between two given days
function day_difference(date1, date2){
  let formatted_date1 = new Date(date1);
  let formatted_date2 = new Date(date2);
  return (formatted_date1 - formatted_date2)/(1000*60*60*24);
}

// Function to filter out the applications who will not give profit
function remove_unprofitabe_applications(loan_application){
  const principal_amount = loan_application.principal;
  const repayments = loan_application.repayments;
  let returned_amount = 0;
  for(let i=0; i<repayments.length; i++){
      returned_amount += repayments[i].amount;
  }
  return returned_amount > principal_amount;
}

// Main function to preprocess loan applications
// It will replace dates with numericals, filter out redundant applications and sort the remaining applications
function preprocess_loan_applications(loan_applications){

  // Converting dates to numericals and removing dates which are not of our interest
  let preprocessed_loan_applications = loan_applications.map(function(loan_application) {
    loan_application.disbursement_date = day_difference(loan_application.disbursement_date,START_DATE);
    loan_application.repayments = loan_application.repayments.map(function(repayment){
      return { date: day_difference(repayment.date,START_DATE), amount: repayment.amount };
    });
    loan_application.repayments = loan_application.repayments.filter(function(repayment){
      return repayment.date >= 0 && repayment.date <= TOTAL_DAYS;
    });
    return loan_application;
  });

  // Removing applications which won't provide profit
  let filtered_loan_applications = preprocessed_loan_applications.filter(remove_unprofitabe_applications);
  return filtered_loan_applications.sort(sort_by_profit);
}

module.exports = {
  preprocess_loan_applications
}

