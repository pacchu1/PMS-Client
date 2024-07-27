import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Employees.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBaradmin from "../SideBaradmin";
import { BASE_URL } from "../../Helper/Helper";

const Employees = () => {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Department");

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const [formData, setFormData] = useState({
    experience: "",
    Skills: "",
    previousrole: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const initialValues = {
    employeeid: employeeId,
    firstname: "",
    lastname: "",
    fathername: "",
    mothername: "",
    department: "",
    desigination: "",
    bloodgroup: "",
    gender: "",
    martialstatus: "",
    dateofbirth: "",
    contactno: "",
    alternateno: "",
    email: "",
    password: "",
    confirmpassword: "",
    localaddress: "",
    permenantaddress: "",
    joiningdate: "",
    worklocation: "",

    aadharno: "",
    panno: "",
    passport: "",
    // drivinglicense: "",

    accountno: "",
    accountname: "",
    ifsccode: "",
    bankname: "",
    // branch: "",
    uan: "",

    tenth: "",
    inter: "",
    ug: "",
    pg: "",
    experience: "fresher",
    previouspayslip: "",
    previousrole: "",
    Skills: "",
    experiencedDropdown: "",
  };

  // const validationSchema = Yup.object().shape({
  //   firstname: Yup.string().required("Full Name is required"),
  //   lastname: Yup.string().required("Last Name is required"),
  //   fathername: Yup.string().required("Father's Name is required"),
  //   mothername: Yup.string().required("Mother's Name is required"),
  //   desigination: Yup.string().required("Desigination is required"),
  //   department: Yup.string().required("Department is required"),
  //   gender: Yup.string().required("Gender is required"),
  //   bloodgroup: Yup.string().required("Blood Group is required"),
  //   martialstatus: Yup.string().required("Marital Status is required"),
  //   dateofbirth: Yup.date().required("Date of Birth is required").nullable(),
  //   contactno: Yup.string().required("Contact Number is required"),
  //   alternateno: Yup.string(),
  //   email: Yup.string()
  //     .email("Invalid email address")
  //     .required("Email is required"),
  //   password: Yup.string().required("Password is required"),
  //   confirmpassword: Yup.string()
  //     .oneOf([Yup.ref("password"), null], "Passwords must match")
  //     .required("Confirm Password is required"),
  //   localaddress: Yup.string().required("Local Address is required"),
  //   permenantaddress: Yup.string().required("Permanent Address is required"),
  //   joiningdate: Yup.date().required("Joining Date is required").nullable(),
  //   worklocation: Yup.string().required("Work Location is required"),
  //   aadhar: Yup.string().required("Aadhar Number is required"),
  //   pan: Yup.string().required("PAN Number is required"),
  //   // passport: Yup.string().required("Passport Number is required"),
  //   accountname: Yup.string().required("Account Holder Name is required"),
  //   accountno: Yup.string().required("Account Number is required"),
  //   ifsccode: Yup.string().required("IFSC Code is required"),
  //   bankname: Yup.string().required("Bank Name is required"),
  //   // uan: Yup.string().required("UAN is required"),
  //   tenth: Yup.string().required("SSC details are required"),
  //   inter: Yup.string().required("Intermediate details are required"),
  //   btech: Yup.string().required("Btech details are required"),
  //   previouspayslip: Yup.string(),
  //   experience: Yup.string().required("Experience details are required"),
  //   previousrole: Yup.string().required("Previous Role details are required"),

  // });

  const onSubmit = (values, { setSubmitting }) => {
    // Submit logic goes here
    console.log(values);
    setSubmitting(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      console.log(values);

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(
        `${BASE_URL}/employee_data/add`,
        formData
      );

      console.log("Response:", response); // Log the entire response

      if (response.status === 201) {
        toast.success("Form submitted successfully");
        setTimeout(() => {
          resetForm();
          setSelectedImage(null);
          setDisplayImage(false);
          setEmployeeId(response.data.employeeid);
          fetchLatestEmployeeId();
          setStep(1);
        });
      } else {
        alert("Error submitting form");
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      toast.error("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setSelectedImage(image);
    setDisplayImage(true);
  };

  const initialValue = "";
  const [latestEmployeeId, setLatestEmployeeId] = useState(initialValue);

  const handleEdit = (currentId) => {
    // Logic to change the employee ID - for example, prompting the user for a new ID
    const newEmployeeId = prompt("Enter new Employee ID:", currentId);

    // Update the latestEmployeeId if a new ID is entered
    if (newEmployeeId !== null && newEmployeeId !== "") {
      setLatestEmployeeId(newEmployeeId);
    }
  };

  // Fetch the latest employee ID from the backend
  const fetchLatestEmployeeId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employee_data/latest_id`);
      const latestId = response.data.latestId;

      // Extract the numeric part and increment
      const numericPart = parseInt(latestId.match(/\d+/), 10);
      const nextNumericPart = isNaN(numericPart) ? 1 : numericPart + 1;

      // Format the new employee ID
      const formattedNextId = `MTSD${nextNumericPart
        .toString()
        .padStart(4, "0")}`;
      setLatestEmployeeId(formattedNextId);
    } catch (error) {
      console.error("Error fetching latest employee ID:", error);
    }
  };

  useEffect(() => {
    fetchLatestEmployeeId();
  }, []);

  return (
    <div className="mothercontainer-admin">
      <SideBaradmin />

      <div className="home01">
        <div className="employee-form-container00023">
          <Formik
            initialValues={initialValues}
            // validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting }) => (
              <Form className="width657">
                {step === 1 && (
                  <div className="outerline01">
                    <h2 className="form-title01">
                      {" "}
                      <u>BASIC DETAILS</u>{" "}
                    </h2>

                    <div className="subcontainer45">
                      <div className="emp011">
                        <div className="image-container2345">
                          <div className="flex124">
                            <div className="small-image1239">
                              {displayImage && (
                                <img
                                  src={
                                    selectedImage
                                      ? URL.createObjectURL(selectedImage)
                                      : "img1_placeholder.jpg"
                                  }
                                  className="IMG1230"
                                  alt="Select"
                                  onClick={() =>
                                    document
                                      .querySelector("#imageInput")
                                      .click()
                                  }
                                  style={{
                                    cursor: "pointer",
                                    marginBottom: "10px",
                                  }}
                                />
                              )}
                            </div>
                            <label className="button222" htmlFor="imageInput">
                              Select Image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: "none" }}
                              id="imageInput"
                            />
                          </div>
                        </div>
                        <div className="minicontainer456">
                          <div className="employee-group98">
                            <div className="emp01132">
                              <label
                                className="employee-label9853"
                                htmlFor="employeeid"
                              >
                                Employee ID{" "}
                              </label>
                              : &nbsp;&nbsp;&nbsp;
                              <div className="readonly-field">
                                {latestEmployeeId}
                              </div>
                            </div>
                          </div>

                          <div className="gridline34">
                            <div className="employee-group98">
                              <label
                                className="employee-label98"
                                htmlFor="firstname"
                              >
                                First Name
                              </label>
                              <Field
                                className="employee-fields98"
                                type="employee-fields"
                                id="firstname"
                                name="firstname"
                                placeholder="Enter your Firstname"
                                required
                              />

                              <ErrorMessage
                                name="firstname"
                                component="div"
                                className="error-message98"
                              />
                            </div>
                            <div className="employee-group98">
                              <label
                                className="employee-label98"
                                htmlFor="lastname"
                              >
                                Last Name
                              </label>
                              <Field
                                className="employee-fields98"
                                type="employee-fields"
                                id="lastname"
                                name="lastname"
                                placeholder="Enter your Lastname"
                                required
                              />

                              <ErrorMessage
                                name="lastname"
                                component="div"
                                className="error-message98"
                              />
                            </div>
                          </div>

                          <div className="gridline34">
                            <div className="employee-group98">
                              <label
                                className="employee-label98"
                                htmlFor="fatherName"
                              >
                                Father Name
                              </label>
                              <Field
                                className="employee-fields98"
                                type="employee-fields"
                                id="fathername"
                                name="fathername"
                                placeholder="Enter your Fathername"
                                required
                              />{" "}
                              <ErrorMessage
                                name="fathername"
                                component="div"
                                className="error-message98"
                              />
                            </div>
                            <div className="employee-group98">
                              <label
                                className="employee-label98"
                                htmlFor="mothername"
                              >
                                Mother Name
                              </label>
                              <Field
                                className="employee-fields98"
                                type="employee-fields"
                                id="mothername"
                                name="mothername"
                                placeholder="Enter your Mothername"
                              />

                              <ErrorMessage
                                name="mothername"
                                component="div"
                                className="error-message98"
                              />
                            </div>
                          </div>

                          <div className="gridline34">
                            <div className="employee-group98">
                              <label
                                className="employee-label98"
                                htmlFor="department"
                              >
                                Department
                              </label>
                              <Field
                              as="select"
                                className="employee-fields98"
                                id="department"
                                name="department"
                                placeholder="Select your Department"
                              >
                                <option value="">Select Department</option>
                                <option value="Full Stack Development">
                                  Full Stack Development
                                </option>
                                <option value="Mobile App Development">
                                 Mobile App Development
                                </option>
                                <option value="Data Science">
                                  Data Science
                                </option>
                                <option value="Data Analyst">
                                  Data Analyst
                                </option>
                                <option value=" Digital Marketing">
                                  Digital Marketing
                                </option>
                              </Field>
                              <ErrorMessage
                                name="department"
                                component="div"
                                className="error-message98"
                              />
                            </div>
                            <div className="employee-group98">
                              <label
                                className="employee-label98"
                                htmlFor="desigination"
                              >
                                Desigination
                              </label>
                              <Field
                              as="select"
                                className="employee-fields98"
                                id="desigination"
                                name="desigination"
                                placeholder="Select your Designation"
                              >
                                <option value="">Select Desigination</option>
                                <option value="App Developer">
                                  App Developer
                                </option>
                                <option value="Web Developer">
                                  Web Developer
                                </option>
                                <option value="Data Scientist">
                                  Data Scientist
                                </option>
                                <option value="Data Analyst">
                                  Data Analyst
                                </option>
                                <option value="Digital Marketing">
                                  Digital Marketing
                                </option>
                              </Field>
                              <ErrorMessage
                                name="desigination"
                                component="div"
                                className="error-message98"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="gridline34">
                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="worklocation"
                            >
                              Work Location
                            </label>
                            <Field
                              as="select"
                              className="employee-fields9807"
                              id="worklocation"
                              name="worklocation"
                            >
                              <option value="">Select</option>
                              <option value="Bangalore">Bangalore</option>
                              <option value="Chennai">Chennai</option>
                              <option value="Hyderabad">Hyderabad</option>
                            </Field>

                            <ErrorMessage
                              name="worklocation"
                              component="div"
                              className="error-message98"
                            />
                          </div>

                          <div className="employee-group98">
                            <label className="employee-label98">
                              Date of Birth
                            </label>
                            <Field
                              className="employee-fields98"
                              type="date"
                              id="dateOfbirth"
                              name="dateofbirth"
                            />

                            <ErrorMessage
                              name="dateofbirth"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                          <div className="employee-group98">
                            <label className="employee-label98">
                              Joining Date
                            </label>
                            <Field
                              className="employee-fields98"
                              type="date"
                              id="joiningdate"
                              name="joiningdate"
                              placeholder="Enter your Joining Date"
                            />

                            <ErrorMessage
                              name="joiningdate"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                        </div>

                        <div className="gridline34">
                          <div className="employee-group98">
                            <label className="employee-label98" htmlFor="email">
                              Email
                            </label>
                            <Field
                              className="employee-fields98"
                              type="employee-email"
                              id="email"
                              name="email"
                              placeholder="Enter your Email"
                            />

                            <ErrorMessage
                              name="email"
                              component="div"
                              className="error-message98"
                            />
                          </div>

                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="password"
                            >
                              Password
                            </label>
                            <Field
                              className="employee-fields98"
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Enter your Password"
                            />

                            <ErrorMessage
                              name="password"
                              component="div"
                              className="error-message98"
                            />
                          </div>

                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="confirmpassword"
                            >
                              Confirm Password
                            </label>
                            <Field
                              className="employee-fields98"
                              type="confirmpassword"
                              id="confirmpassword"
                              name="confirmpassword"
                              placeholder="Enter your Confirm Password"
                            />

                            <ErrorMessage
                              name="confirmpassword"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                        </div>
                        <div className="gridline34">
                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="gender"
                            >
                              Gender
                            </label>
                            <Field
                              as="select"
                              className="employee-fields9807"
                              id="gender"
                              name="gender"
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="Hyderabad">Other</option>
                            </Field>

                            <ErrorMessage
                              name="gender"
                              component="div"
                              className="error-message98"
                            />
                          </div>

                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="martialstatus"
                            >
                              Marital Status
                            </label>
                            <Field
                              as="select"
                              className="employee-fields9807"
                              id="martialstatus"
                              name="martialstatus"
                            >
                              <option value="">Select</option>
                              <option value="single">Single</option>
                              <option value="married">Married</option>
                            </Field>

                            <ErrorMessage
                              name="martialstatus"
                              component="div"
                              className="error-message98"
                            />
                          </div>

                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="contactno"
                            >
                              Contact No
                            </label>
                            <Field
                              className="employee-fields98"
                              type="number"
                              id="contactno"
                              name="contactno"
                              placeholder="Enter your Contact Number"
                            />

                            <ErrorMessage
                              name="contactno"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                        </div>
                        <div className="gridline34">
                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="bloodgroup"
                            >
                              Blood Group
                            </label>
                            <Field
                              as="select"
                              className="employee-fields9807"
                              id="bloodgroup"
                              name="bloodgroup"
                            >
                              <option value="">Select</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </Field>

                            <ErrorMessage
                              name="bloodgroup"
                              component="div"
                              className="error-message98"
                            />
                          </div>

                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="alternateno"
                            >
                              Alternate No
                            </label>
                            <Field
                              className="employee-fields98"
                              type="number"
                              id="alternateno"
                              name="alternateno"
                              placeholder="Enter your Alternate Number"
                            />

                            <ErrorMessage
                              name="alternateno"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="permenantaddress"
                            >
                              Permanent Address
                            </label>
                            <Field
                              className="employee-fields98"
                              type="text"
                              id="permenantaddress"
                              name="permenantaddress"
                              placeholder="Enter your Permanent Address"
                            />

                            <ErrorMessage
                              name="permenantaddress"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                        </div>

                        <div className="gridline3435">
                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="localaddress"
                            >
                              Local Address
                            </label>
                            <Field
                              className="employee-fields98"
                              type="text"
                              id="localaddress"
                              name="localaddress"
                              placeholder="Enter your Permanent Address"
                            />

                            <ErrorMessage
                              name="localaddress"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="employee-group988">
                      <button
                        className="employee-button98"
                        type="button"
                        onClick={handleNext}
                        data-aos="fade-up"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="outerline02">
                    <div className="outsideborderr9999">
                      <h2>IDENTITY DETAILS</h2>
                    </div>

                    <div className="gridline34">
                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="aadhar">
                          Aadhar No
                        </label>
                        <Field
                          className="employee-fields98"
                          type="aadhar"
                          id="aadhar"
                          name="aadhar"
                          placeholder="Enter your Aadhar Number"
                        />

                        <ErrorMessage
                          name="aadhar"
                          component="div"
                          className="error-message98"
                        />
                      </div>

                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="pan">
                          PAN No
                        </label>
                        <Field
                          className="employee-fields98"
                          type="text"
                          id="pan"
                          name="pan"
                          placeholder="Enter your PAN Number"
                        />

                        <ErrorMessage
                          name="pan"
                          component="div"
                          className="error-message98"
                        />
                      </div>
                    </div>

                    <div className="gridline34">
                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="passport">
                          Passport
                        </label>
                        <Field
                          className="employee-fields98"
                          type="text"
                          id="passport"
                          name="passport"
                          placeholder="Enter your Passport"
                        />

                        <ErrorMessage
                          name="passport"
                          component="div"
                          className="error-message98"
                        />
                      </div>

                      {/* <div className="employee-group98">
                        <label
                          className="employee-label98"
                          htmlFor="drivinglicense"
                        >
                          Driving License
                        </label>
                        <Field
                          className="employee-fields98"
                          type="text"
                          id="drivinglicense"
                          name="drivinglicense"
                          placeholder="Not Mandatory"
                        />

                        <ErrorMessage
                          name="drivinglicense"
                          component="div"
                          className="error-message98"
                        />
                      </div> */}
                    </div>

                    <div className="box1020">
                      <div className="outsideborderr9999">
                        <h2>PROFESSIONAL DETAILS</h2>{" "}
                      </div>

                      <div className="linechange25">
                        <div className="employee-group98">
                          <label
                            className="employee-label98"
                            htmlFor="accountname"
                          >
                            Account Type
                          </label>
                          <Field
                            className="employee-fields98"
                            type="employee-fields"
                            id="accountname"
                            name="accountname"
                            placeholder="Enter your Account Type"
                          />

                          <ErrorMessage
                            name="accountname"
                            component="div"
                            className="error-message98"
                          />
                        </div>
                        <div className="employee-group98">
                          <label
                            className="employee-label98"
                            htmlFor="accountno"
                          >
                            Account Number
                          </label>
                          <Field
                            className="employee-fields98"
                            type="number" // Change type to "text" to allow custom pattern validation
                            id="accountno"
                            name="accountno"
                            pattern="[0-9]*" // This pattern allows only numeric input
                            placeholder="Enter your Account Number"
                          />

                          <ErrorMessage
                            name="accountno"
                            component="div"
                            className="error-message98"
                          />
                        </div>
                      </div>

                      <div className="linechange25">
                        <div className="employee-group98">
                          <label
                            className="employee-label98"
                            htmlFor="ifsccode"
                          >
                            IFSC Code
                          </label>
                          <Field
                            className="employee-fields98"
                            type="text"
                            id="ifsccode"
                            name="ifsccode"
                            placeholder="Enter your IFSC Code"
                          />

                          <ErrorMessage
                            name="ifsccode"
                            component="div"
                            className="error-message98"
                          />
                        </div>
                        <div className="employee-group98">
                          <label
                            className="employee-label98"
                            htmlFor="bankname"
                          >
                            Bank Name
                          </label>
                          <Field
                            className="employee-fields98"
                            type="text"
                            id="bankname"
                            name="bankname"
                            placeholder="Enter your Bank Name"
                          />

                          <ErrorMessage
                            name="bankname"
                            component="div"
                            className="error-message98"
                          />
                        </div>
                      </div>

                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="branch">
                          Branch
                        </label>
                        <Field
                          className="employee-fields98"
                          type="text"
                          id="branch"
                          name="branch"
                          placeholder="Enter your Branch Name"
                        />
                        <ErrorMessage
                          name="branch"
                          component="div"
                          className="error-message98"
                        />
                      </div>

                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="uan">
                          UAN
                        </label>
                        <Field
                          className="employee-fields98"
                          type="text"
                          id="uan"
                          name="uan"
                          placeholder="Enter your UAN Name"
                        />
                        <ErrorMessage
                          name="uan"
                          component="div"
                          className="error-message98"
                        />
                      </div>

                      <div className="btn3214">
                        <button
                          className="employee-button98"
                          type="button"
                          onClick={handleBack}
                          data-aos="fade-up"
                        >
                          Back
                        </button>
                        <button
                          className="employee-button98"
                          type="button"
                          onClick={handleNext}
                          data-aos="fade-up"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="outerline02">
                    <div className="outsideborderr9999">
                      <div>
                        <h2>
                          {" "}
                          <u>DOCUMENTATION</u>{" "}
                        </h2>{" "}
                        <br />
                      </div>
                    </div>

                    <div className="linechange25">
                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="tenth">
                          SSC
                        </label>
                        <Field
                          className="employee-fields98 file23"
                          type="file"
                          id="tenth"
                          name="tenth"
                          multiple // Allow multiple files to be selected
                        />

                        <ErrorMessage
                          name="tenth"
                          component="div"
                          className="error-message98"
                        />
                      </div>

                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="inter">
                          Inter
                        </label>
                        <Field
                          className="employee-fields98 file23"
                          type="file"
                          id="inter"
                          name="inter"
                          multiple // Allow multiple files to be selected
                        />

                        <ErrorMessage
                          name="inter"
                          component="div"
                          className="error-message98"
                        />
                      </div>
                    </div>

                    <div className="linechange25">
                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="ug">
                          UG
                        </label>
                        <Field
                          className="employee-fields98 file23"
                          type="file"
                          id="ug"
                          name="ug"
                          multiple // Allow multiple files to be selected
                        />

                        <ErrorMessage
                          name="ug"
                          component="div"
                          className="error-message98"
                        />
                      </div>

                      <div className="employee-group98">
                        <label className="employee-label98" htmlFor="pg">
                          PG
                        </label>
                        <Field
                          className="employee-fields98 file23"
                          type="file"
                          id="pg"
                          name="pg"
                          multiple // Allow multiple files to be selected
                        />

                        <ErrorMessage
                          name="pg"
                          component="div"
                          className="error-message98"
                        />
                      </div>
                    </div>

                    <div className="linechange25">
                      {/* <div className="sub-con1199"> */}
                      <div className="employee-group98">
                        <label className="employee-label98">Experience:</label>
                        {/* <div className="dropdown"> */}
                        <Field
                          as="select"
                          name="experience"
                          className="employee-fields9807"
                        >
                          <option value="fresher">Fresher</option>
                          <option value="experienced">Experienced</option>
                        </Field>
                        {/* </div> */}
                      </div>
                      {values.experience === "fresher" && (
                        <div className="employee-group98">
                          <label
                            htmlFor="fresherDescription"
                            className="employee-label98"
                          >
                            Skills
                          </label>{" "}
                          <Field
                            type="text"
                            as="textarea"
                            name="fresherDescription"
                            className="employee-fields9841"
                            id="fresherDescription"
                            placeholder="Enter description..."
                          />
                        </div>
                      )}
                      {/* </div> */}

                      {values.experience === "experienced" && (
                        <div className="employee-group98">
                          <label htmlFor="Skills" className="employee-label98">
                            Skills
                          </label>
                          <Field
                            type="text"
                            name="Skills"
                            className="employee-fields98"
                            id="Skills"
                            placeholder="Enter Skills..."
                          />
                        </div>
                      )}
                    </div>
                    {values.experience === "experienced" && (
                      <div>
                        <div className="exp887">
                          <div className="employee-group98">
                            <label
                              htmlFor="experiencedDropdown"
                              className="employee-label98"
                            >
                              Years of Experience
                            </label>
                            <Field
                              as="select"
                              name="experiencedDropdown"
                              id="experiencedDropdown"
                              className="employee-fields9807"
                            >
                              {/* Options for experienced dropdown */}
                              <option value="">Years of Experience</option>
                              <option value="Below 1 Year">Below 1 Year</option>
                              <option value="1 Year">1-2 Years</option>
                              <option value="2 Year">2-3 Years</option>
                              <option value="3 Year">3-4 Years</option>
                              <option value="4 Year">4-5 Years</option>
                              <option value="5 Year">5+ Years</option>
                            </Field>
                          </div>
                          <div className="employee-group98">
                            <label
                              className="employee-label98"
                              htmlFor="previousrole"
                            >
                              Previous-Role
                            </label>
                            <Field
                              className="employee-fields98"
                              type="text"
                              id="previousrole"
                              name="previousrole"
                              placeholder="Enter your Previous-Role"
                            />
                            <ErrorMessage
                              name="previousrole"
                              component="div"
                              className="error-message98"
                            />
                          </div>
                        </div>
                        <div className="employee-group98">
                          <label
                            className="employee-label98 "
                            htmlFor="previouspayslip"
                          >
                            Previous-Payslip
                          </label>
                          <Field
                            className="employee-fields98 file23"
                            type="file"
                            id="previouspayslip"
                            name="previouspayslip"
                            multiple // Allow multiple files to be selected
                            required
                          />
                          <ErrorMessage
                            name="previouspayslip"
                            component="div"
                            className="error-message98"
                          />
                        </div>
                      </div>
                    )}

                    {/* Fields for step 2 */}
                    {/* ... (Step 2 fields) */}
                    <div className="employee-group988">
                      <button
                        className="employee-button98"
                        type="button"
                        onClick={handleBack}
                        data-aos="fade-up"
                      >
                        Back
                      </button>
                      <button
                        className="employee-button98"
                        type="submit"
                        disabled={isSubmitting}
                        data-aos="fade-up"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Employees;
