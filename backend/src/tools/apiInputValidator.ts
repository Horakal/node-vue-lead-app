import { body } from "express-validator";

function ValidateCreateLead() {
  return [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .trim()
      .normalizeEmail()
      .notEmpty()
      .withMessage("Email is required"),
    body("jobTitle")
      .isString()
      .withMessage("Job Title must be a string")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Job Title is required"),
    body("birthDate")
      .isDate()
      .withMessage("Birth Date must be a valid date")
      .notEmpty()
      .withMessage("Birth Date is required"),
    body("message")
      .isString()
      .withMessage("Message must be a string")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Message is required"),
    body("phone")
      .isString()
      .withMessage("Phone must be a string")
      .trim()
      .notEmpty()
      .withMessage("Phone is required")
      .custom((value) => {
        // remove any non-digit characters so formatted phones like
        // (11) 99876-5432 become 11998765432
        const cleaned = String(value).replace(/\D/g, "");
        const phoneRegex =
          /^(1[1-9]|[4689][0-9]|2[12478]|3([1-5]|[7-8])|5([13-5])|7[193-7])9[0-9]{8}$/;
        if (!phoneRegex.test(cleaned)) {
          throw new Error("Invalid phone number format");
        }
        return true;
      }),
  ];
}

export { ValidateCreateLead };
