import Button from "./Button"
import { useState, useEffect } from "react"
import axios from "axios"

const ManageUsers = () => {
    const [usersList, setUsersList] = useState([])
    const [userData, setUserData] = useState({_id: '', firstName: '', lastName: '', email: '', age: 0, sex: ''})

    const [formErrors, setFormErrors] = useState({})
    const [isFormValid, setIsFormValid] = useState(false)

    const [loading, setLoading] = useState(false)

    const saveUser = e => {
        e.preventDefault()
        if (!userData._id){
            addUser()
        } else {
            setUserData(userData)
            updateUser(userData._id)
        }
        setUserData({_id: '', firstName: '', lastName: '', email: '', age: 0, sex: ''})
    }

    const handleInputChange = e => {
        setUserData(prevUserData => {
            return {
                ...prevUserData,
                [e.target.name]: e.target.value,
            }
        }
    )}

    const editUser = (_id) => {
        const editedUser = usersList.find(el => el._id === _id)
        setUserData(editedUser)
    }

    const removeUser = (_id) => {
        deleteUser(_id)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            const validationresult = validate(userData)
            setFormErrors(validationresult)
            if (
                userData.firstName &&
                !validationresult.firstName &&
                userData.lastName &&
                !validationresult.lastName &&
                userData.email &&
                !validationresult.email &&
                userData.age &&
                !validationresult.age
            ) {
                setIsFormValid(true)
            } else {
                setIsFormValid(false)
            }
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [userData])

    const validate = (values) => {
        const errors = {}
        if (values.firstName && values.firstName.length < 4) {
            errors.firstName = 'სახელი უნდა შეიცავდეს არანაკლებ 4 სიმბოლოს!'
        }
        if (values.lastName && values.lastName.length < 4) {
            errors.lastName = 'გვარი უნდა შეიცავდეს არანაკლებ 4 სიმბოლოს!'
        }
        if (values.email && !values.email.includes('@gmail.com')) {
            errors.email = 'მეილი უნდა შეიცავდეს @gmail.com-ს'
        }
        if (values.age && values.age < 18) {
            errors.age = 'მინიმალური ასაკია 18 წელი'
        }
        return errors
    }

    //--------------------   GET List  ---------------------------
    const getAllUsers = async () => {
        try {
            const {data} = await axios.get("http://localhost:3001/users")
            setUsersList(data.data)
        } catch (err) {
            setUsersList((err.response?.data || err))
        }
      }

    useEffect(() => {
        getAllUsers()
    }, [usersList])
    //---------------------   GET List  --------------------------
    
    //--------------------   POST  -------------------------------
    const addUser = async () => {
        try {
            await axios.post("http://localhost:3001/users", userData)
        } catch (err) {
            throw new Error('მომხმარებლის დამატებისას მოხდა შეცდომა!')
        }
    }
    //---------------------   POST  ------------------------------

    //--------------------   PUT  -------------------------------
    const updateUser = async (_id) => {
        try {
            await axios.put(`http://localhost:3001/users/${_id}`, userData)
        } catch (err) {
            throw new Error('მომხმარებლის რედაქტირებისას მოხდა შეცდომა!')
        }
    }
    //---------------------   PUT  ------------------------------

    //--------------------   DELETE  -------------------------------
    const deleteUser = async (_id) => {
        try {
            await axios.delete(`http://localhost:3001/users/${_id}`, userData)
        } catch (err) {
            throw new Error('მომხმარებლის წაშლისას მოხდა შეცდომა!')
        }
    }
    //---------------------  DELETE  ------------------------------

    return (
        <>
            <h2>Manage Users</h2>
            <form onSubmit={saveUser}>
                <div>
                    <label>
                    მიუთითეთ სახელი:
                        <input 
                            type="text"
                            name='firstName'
                            placeholder="firstName"
                            value={userData.firstName}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                {formErrors.firstName && <p style={{ fontWeight: 'bold', color: 'red' }}>{formErrors.firstName}</p>}

                <div>
                    <label>
                    მიუთითეთ გვარი:
                        <input
                            type="text"
                            name='lastName'
                            value={userData.lastName}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                {formErrors.lastName && <p style={{ fontWeight: 'bold', color: 'red' }}>{formErrors.lastName}</p>}

                <div>
                    <label>
                    მიუთითეთ ელ. ფოსტა:
                        <input
                            type="text"
                            name='email'
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                {formErrors.email && <p style={{ fontWeight: 'bold', color: 'red' }}>{formErrors.email}</p>}

                <div>
                    <label>
                    მიუთითეთ ასაკი:
                        <input
                            type="number"
                            name='age'
                            value={userData.age}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                {formErrors.age && <p style={{ fontWeight: 'bold', color: 'red' }}>{formErrors.age}</p>}

                <div>
                    <label>
                    მიუთითეთ სქესი:
                        <select name='sex' onChange={handleInputChange} defaultValue={'female'}>
                            <option value={'female'}>მდედრ.</option>
                            <option value={'male'}>მამრ.</option>
                        </select>
                    </label>
                </div>

                <Button disabled={!isFormValid}>შენახვა</Button>
            </form>
            <hr/>

            {loading && <h2>Loading...</h2>}

            <ul>
                {usersList.map((elem) => {
                    return <li key={elem._id}>{elem.firstName} | {elem.lastName} | {elem.email} | {elem.age} | {elem._id} | {elem.sex} |
                        <Button onClick={() => editUser(elem._id)}>რედაქტირება</Button> | 
                        <Button onClick={() => removeUser(elem._id)}>წაშლა</Button>
                    </li>
                })}
            </ul>

            <hr/>

        </>
    )
}

export default ManageUsers
