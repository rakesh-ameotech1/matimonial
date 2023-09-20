import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LookingForModal from '../../components/SignupModal/LookingForModal';
import SignUpModal from '../../components/SignupModal/SignUpModal';
import Layout from '../../Layout'
import { getReligion, registerUser } from '../../Redux/Actions/AuthAction';
import { validEmail, validPassword } from '../../Utils/Validation';

import { toastify } from '../../Utils/Function';
import { toast } from 'react-toastify';

const SignUp = () => {
    const dispatch = useDispatch()
    const [register, setRegister] = useState({
        profile_for: "",
        dob: "",
        dobYear: "",
        dobMonth: "",
        religion: "",
        community: "",
        living_in: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        mobile_number: "",
        gender: ""
    })
    const [modalShow, setModalShow] = useState(false);
    const [lookingForModal, setLookingForModal] = useState(false)
    const [error, setError] = useState(false)
    const [years, setYears] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const reducerData = useSelector(state => state)
    const { Auth: { registrationRequest } } = reducerData
    const handleRegister = (e) => {
        const { name, value, id } = e.target;
        setRegister((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!!register.email?.length && !!register.password?.length && register.community && register.confirm_password && register.living_in && register.mobile_number && register.password && register.religion && register.username) {
            if (!validEmail(register.email) && !validPassword(register.password) && register.mobile_number?.length !== 10) {
                setError(true)
            } else {
                if (!validEmail(register.email)) {
                    setError(true)
                } else if (!validPassword(register.password)) {
                    setError(true)
                } else if (register.mobile_number?.length !== 10) {
                    setError(true)
                } else {
                    dispatch(registerUser(register))
                    toastify(toast, "Welcome, your account is successfully registered", "dark")
                }
            }
        } else {
            setError(true)
        }
        setTimeout(() => setError(false), 5000)
    }
    const handleLookingFor = (item) => {
        if (item.looking !== "My Self") {
            setModalShow(true)
            setLookingForModal(false)
            setRegister({ ...register, gender: item.gender, profile_for: item.looking })
        } else {
            setRegister({ ...register, profile_for: item.looking })
        }
        setSelectedId(item.id)
    }
    const handleGender = (gender) => {
        setRegister({ ...register, gender: gender })
        setModalShow(true)
        setLookingForModal(false)
    }
    useEffect(() => {
        if (register.dob && register.dobMonth && register.dobYear) {
            let obj = { ...register }
            let newObj = { ...register, date_of_birth: obj.dobYear + "-" + obj.dobMonth + "-" + obj.dob }
            delete newObj.dob
            delete newObj.dobMonth
            delete newObj.dobYear
            setRegister(newObj)

        }
    }, [register.dob, register.dobMonth, register.dobYear])
    useEffect(() => {
        if (register.community && register.religion && register.living_in) {
            setModalShow(false)
            toastify(toast, "Add Some Information Regarding your Profile", "dark")
        }
    }, [register.community, register.religion, register.living_in])
    useEffect(() => {
        setLookingForModal(true)
        dispatch(getReligion())
    }, [])


    /*make a year array based on gender legal age*/
    useEffect(() => {
        let legalAge = register.gender === "Male" ? 21 : 18
        let max = new Date().getFullYear() - legalAge
        let years = []
        for (let i = max; i >= 1950; i--) {
            years.push(i)
        }
        setYears(years)
    }, [register.gender])
    return (
        <div>
            <Layout >
                <div className='pt-5'>
                    <section className="page-title" style={{ backgroundColor: "#800925" }}>
                        <div className="auto-container">
                            <h1 className="d-none d-lg-block d-xl-block d-md-block">Signup</h1>
                            <ul className="bread-crumb clearfix">
                                <li><a href="index">Home</a></li>
                                <li>Signup</li>
                            </ul>
                        </div>
                    </section>
                    <section className="newsletter-section ">
                        <div className="anim-icons full-width">
                            <span className="icon icon-shape-3 wow fadeIn"></span>
                            <span className="icon icon-line-1 wow fadeIn"></span>
                        </div>
                        <div className="auto-container">
                            <div className="upper-box">
                                <div className="sec-title text-center">
                                    <div className="text"><h2 className="title">Matches Within Your community,</h2>Verified Profile | Safe and Secured | Entire Profile Description.</div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-lg-12 alert alert-info " id="doberror" style={{ display: 'none' }}>Select valid Birth Date</div>
                                <div className="col-lg-12 alert alert-info" id="doberror1" style={{ display: 'none' }}></div>
                                <div className="col-lg-12 alert alert-info " id="doberror2" style={{ display: 'none' }}></div>
                                <div className="col-lg-2 col-md-4 col-sm-4">
                                </div>
                                <div className="form-column col-lg-8 col-md-12 col-sm-12">
                                    <div className="inner-column">
                                        <div className="contact-form ">

                                            <form method="post" action="#" id="contact-form" name="matri" onSubmit={(e) => handleSubmit(e)}>
                                                <div className="row clearfix">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                                        <input type="text" name="username" placeholder="User Name" maxlength="20" value={register.username} onChange={(e) => handleRegister(e)} />
                                                        <p className="form-text " style={{ color: "red" }}>{(!register.username.length && error) ? "User Name is Required" : (register.username.length < 4 && error) ? "User Name must be of more than 5 and less than 20 characters." : ""}</p>
                                                    </div>


                                                    <div className="col-lg-12 col-md-12 col-sm-12 form-group mt-3" id="emailerror">
                                                        <input type="email" autofocus name="email" placeholder="Email ID." value={register.email} onChange={(e) => handleRegister(e)} />
                                                        <p className="form-text " style={{ color: "red" }}>{(!register.email.length && error) ? "Email is Required" : (!validEmail(register.email) && error) ? "Input Field accepts only valid email format string with @ symbol" : ""}</p>
                                                        <div className="mt-2 "></div>

                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 form-group mt-3" id="">
                                                        <input type="number" autofocus name="mobile_number" placeholder="Mobile No." value={register.mobile_number} onChange={(e) => handleRegister(e)} />
                                                        <p className="form-text " style={{ color: "red" }}>{(!register.mobile_number.length && error) ? "Mobile Number is required" : (error && register.mobile_number.length != 10 || register.mobile_number.length > 10) ? "Mobile Number is not valid" : ""}</p>
                                                        <div className="mt-2 "></div>

                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-12 form-group ">
                                                        <select className="custom-select-box" name="dobMonth" tabindex="7" id="month" onChange={(e) => handleRegister(e, 'dob')}>
                                                            <option value="" disabled selected hidden>Birth Month</option>
                                                            <option value="1">January</option>
                                                            <option value="2">February</option>
                                                            <option value="3">March</option>
                                                            <option value="4">April</option>
                                                            <option value="5">May</option>
                                                            <option value="6">Jun</option>
                                                            <option value="7">July</option>
                                                            <option value="8">August</option>
                                                            <option value="9">September</option>
                                                            <option value="10">October</option>
                                                            <option value="11">November</option>
                                                            <option value="12">December</option>
                                                        </select>
                                                        <p className="form-text " style={{ color: "red" }}>{(!register?.date_of_birth && error) ? "Please select the Birth Month" : ""}</p>
                                                    </div>

                                                    <div className="col-lg-4 col-md-4 col-sm-12 form-group " onChange={(e) => handleRegister(e, "dob")}>
                                                        <select name="dob" className="custom-select-box" tabindex="8" id="day" >
                                                            <option value="" disabled selected hidden>Birth Day</option>
                                                            {[...Array(31)].map((_, i) => {
                                                                i = i + 1
                                                                return <option value="1">{i}</option>
                                                            })}
                                                        </select>
                                                        <p className="form-text " style={{ color: "red" }}>{(!register?.date_of_birth && error) ? "Please select the Birth Day" : ""}</p>
                                                    </div>

                                                    <div className="col-lg-4 col-md-4 col-sm-12 form-group ">
                                                        <select name="dobYear" className="custom-select-box" tabindex="9" id="year" onChange={(e) => handleRegister(e,)} required>
                                                            <option value="" disabled selected hidden>Birth Year</option>
                                                            {years.map((o) => {
                                                                return <option value={o} >{o}</option>
                                                            })}
                                                        </select>
                                                        <p className="form-text " style={{ color: "red" }}>{(!register.date_of_birth && error) ? "Please select the Birth Year" : ""}</p>

                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                                        <input type="password" name="password" placeholder="Password" maxlength="35" onChange={(e) => handleRegister(e)} />
                                                        <p className="form-text " style={{ color: "red" }}>{(!register.password.length && error) ? " Password is Required" : (error && !validPassword(register.password)) ? "Input accepts a combination of one uppercase & lowercase letter, number, special characters & minimum characters length 8. Even It will not accept any white spaces." : ""}</p>

                                                        <div className="mt-2 " style={{ display: "none" }}>Password is too weak</div>
                                                    </div>
                                                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                                        <input type="password" name="confirm_password" placeholder=" Confirm password" maxlength="35" onChange={(e) => handleRegister(e)} />
                                                        <p className="form-text " style={{ color: "red" }}>{(!register.password.length && error) ? " Confirm Password is Required" : (error && register.password != register.confirm_password) ? "Input Field must be matched with the values of password input Field" : ""}</p>

                                                        <div className="mt-2 " style={{ display: "none" }}>Password is too weak</div>
                                                    </div>

                                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                                        <div className="btn-box">
                                                            <div className="text"><input type="checkbox" checked tabindex="10" style={{ verticalAlign: "text-bottom" }} />  I have read and agree to the <a href="#" target={"_blank"}><u>terms, conditions</u></a> and <a href="#" target={"_blank"}><u>  privacy policy.</u> </a></div>
                                                        </div>
                                                        <a><button className="theme-btn btn btn-style-one mt-4 mb-4" type="submit" name="submit" style={{ width: "100%" }}> <span tabindex="11" className="btn-title">Register  </span></button></a>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section >
                    <SignUpModal setModalShow={setModalShow} modalShow={modalShow} handleRegister={handleRegister} />
                    <LookingForModal setModalShow={setLookingForModal} modalShow={lookingForModal} handleLookingFor={(item) => handleLookingFor(item)} selectedId={selectedId} handleGender={handleGender} />
                </div>
            </Layout >
        </div >
    )
}

export default SignUp;