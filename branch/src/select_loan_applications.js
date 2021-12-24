const MAX_ACTIVE_DAYS = 90;
const TOTAL_DAYS = 365;

// Checks if the giving loan to the application clashes with prior given loans
function check_loan_eligibility(loan_application, daily_loan_transactions_number, daily_in_hand_amount, initial_amount, max_active_loans) {

  // Making copy array so that if changes are to be reverted
  let current_daily_loan_transactions_number = daily_loan_transactions_number;
  let current_daily_in_hand_amount = daily_in_hand_amount;
  const repayments = loan_application.repayments;
  const disbursement_date = loan_application.disbursement_date;
  // Last active date should be either last repayment date or max_active_days that loan can have
  const last_active_date = Math.min(repayments[repayments.length - 1].date, disbursement_date + MAX_ACTIVE_DAYS);
  current_daily_loan_transactions_number[disbursement_date]++;
  current_daily_loan_transactions_number[last_active_date]--;
  current_daily_in_hand_amount[disbursement_date] -= loan_application.principal;
  repayments.forEach((repayment) => {
    current_daily_in_hand_amount[repayment.date] += repayment.amount;
  });

  let in_hand_amount = initial_amount;
  let active_loans = 0;

  // Checking if conditions are getting violated
  for (let day = 0; day <= TOTAL_DAYS; day++) {
    active_loans += current_daily_loan_transactions_number[day];
    in_hand_amount += current_daily_in_hand_amount[day];
    if (active_loans > max_active_loans || in_hand_amount < 0) {
      return {
        eligible: false
      }
    }
  }

  return {
    eligible: true,
    current_daily_loan_transactions_number,
    current_daily_in_hand_amount
  }
}

function user_has_active_loan(users_loan_mapping, customer_id, disbursement_date, loan_active_till_date){
  if(users_loan_mapping.has(customer_id)==false){
    return true;
  }
  let clashes_with_existing_loan = false;
  users_loan_mapping.get(customer_id).forEach(function(active_loan_dates){
    if(active_loan_dates[0]<disbursement_date&&active_loan_dates[1]>disbursement_date){
      clashes_with_existing_loan = true;
    }
    if(active_loan_dates[0]<loan_active_till_date&&active_loan_dates[1]>loan_active_till_date){
      clashes_with_existing_loan = true;
    }
    if(active_loan_dates[0]==disbursement_date&&active_loan_dates[1]==loan_active_till_date){
      clashes_with_existing_loan = true;
    }
  });
  return clashes_with_existing_loan == false;
}

// Main function to return list of application ids to which loan has to be provided
function select_loan_applications(loan_applications, initial_amount, max_active_loans) {

  let sanctioned_loan_ids = [];
  let users_loan_mapping = new Map(); // Will map user id with a date till when he/she can not take other loan
  let daily_loan_transactions_number = new Array(TOTAL_DAYS + 1).fill(0);
  let daily_in_hand_amount = new Array(TOTAL_DAYS + 1).fill(0);

  loan_applications.forEach((loan_application) => {
    const should_provide_loan = check_loan_eligibility(
      loan_application,
      daily_loan_transactions_number,
      daily_in_hand_amount,
      initial_amount, max_active_loans
    );
    const disbursement_date = loan_application.disbursement_date;
    const customer_id = loan_application.customer_id;
    const last_repayment_date = loan_application.repayments[loan_application.repayments.length - 1].date;
    const loan_active_till_date = last_repayment_date <= disbursement_date + MAX_ACTIVE_DAYS ? last_repayment_date : TOTAL_DAYS;
    // console.log(func(users_loan_mapping, customer_id, disbursement_date, loan_active_till_date))
    if (user_has_active_loan(users_loan_mapping, customer_id, disbursement_date, loan_active_till_date) &&
      should_provide_loan.eligible) {
      // If application satisfies all the criterias then push application id in result array
      sanctioned_loan_ids.push(loan_application.application_id);
      daily_loan_transactions_number = should_provide_loan.current_daily_loan_transactions_number;
      daily_in_hand_amount = should_provide_loan.current_daily_in_hand_amount;
      if(users_loan_mapping.has(customer_id) == false){
        users_loan_mapping.set(customer_id, [[disbursement_date, loan_active_till_date]]);
      } else{
        users_loan_mapping.get(customer_id).push([disbursement_date, loan_active_till_date]);
      }
    }
  });

  return sanctioned_loan_ids;
}

module.exports = {
  select_loan_applications
}

