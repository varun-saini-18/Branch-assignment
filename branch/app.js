// Importing all modules
const { get_loan_applications, print_sanctioned_loan_ids } = require('./src/file_io');
const { preprocess_loan_applications } = require('./src/preprocess_loan_applications');
const { select_loan_applications } = require('./src/select_loan_applications'); 

// Importing arguments from cmd line
const arguments = process.argv.slice(2);

// Handling the case if number of arguments are less than required
if(arguments.length<4){
  console.log("Please Validate all the arguments!");
  console.log("Arg1: Input file location.");
  console.log("Arg2: Output file location.");
  console.log("Arg3: Total in hand amount initialy.");
  console.log("Arg4: Maximum number of concurrent loan applications at a given time");
}
else{
  const input_file = arguments[0];
  const output_file = arguments[1];
  const initial_amount = arguments[2];
  const max_active_loans = arguments[3];

  // Handling the case if initial amount is less than zero or max active loans limit is less than zero
  if(initial_amount < 0 || max_active_loans < 0){
    console.log("Please enter valid arguments.")
    return;
  }

  try{
    // Parsing JSON file from given input location
    const loan_applications= get_loan_applications(input_file);

    // Preprocessing to convert dates to numerical value. Numerical value x means x days after '2020-01-01'
    const preprocessed_loan_applications = preprocess_loan_applications(loan_applications);

    // Selecting loans applications id to which loan has to be provided
    const selected_loan_ids = select_loan_applications(preprocessed_loan_applications, initial_amount, max_active_loans);

    // Printing output to given location
    print_sanctioned_loan_ids(selected_loan_ids,output_file);
  } catch (err) {
    // console.log('Entered file location is not found.');
    console.log(err);
  }
  
}

