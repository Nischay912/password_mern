// step42: so instead of localstorage , now the passwords will be coming from the database here.
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const eyeRef = useRef()
    const passRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])
    
    // step45: now we make this function as async as we want to use "await" inside this function below.
    const getPasswords = async () =>{
        // step46: we make a GET request to the server using the fetch API
        let req = await fetch("https://pass-mern-backend.onrender.com")
        // step47: then we wait for response and then parses it to JSON , because : The fetch() function returns a Response object , so we need to convert it to JSON object now here : so we do this to transform the raw HTTP response into usable JS data ; and since it returns a promise , which we parse to JSON ; so as usual we await for promises , so here also we await for it , to wait until all data is retrieved successfully from there.
        let passwords = await req.json()
        // step48: then we update the passwordArray with the array of objects returned from the backend server
        setpasswordArray(passwords)
        // step49: log to console for debugging and seeing the passwords fetched for verification : WILL COMMENT THIS LATER.
        // console.log(passwords)
        // step50: still error was coming as CORS was not used : cors is always needed when the frontend and backend are working on different ports : Your frontend and backend are on different origins (ports), so you need CORS to let frontend access backend data. So, lets enable CORS in the backedn folder in the next ateps now there.

        // step53: after that now when we refresh the page : we can see the data from backend mongoDB to be displayed there & even in the console since we logged it on console too above : WE MAY SEE IT TWICE IN CONSOLE DUE TO THE : STRICT MODE OF THE REACT APP BY RULE : BUT IT DOESN'T DO THINGS TWICE IN PRODUCTION WHEN HOSTED : ITS JUST FOR SAFETY CROSS CHECK TWICE WHEN DOING DEVLEOPMENT ONLY THERE/HERE.
    }

    // useEffect(() => {
    //     let passwords = localStorage.getItem("passwords")
    //     if (passwords) {
    //         setpasswordArray(JSON.parse(passwords))
    //     }
    // }, [])
    
    // step43: now we comment the previous use effect that loaded the passwords from localStorage using useEffect everytime the webpage is reloaded ; but now we have to retrieve it from the database , so lets comment out the above useEffect and write it below now.

    // step44: make it call another function , so that things are clear there as useEffect cannot be made async by rule , because : async functions return a Promise, but useEffect expects either: Nothing (undefined), or a cleanup function (not a Promise). , so better do in another function only and call it here below then now.
    useEffect(()=>{
        getPasswords();

    },[])


    useEffect(() => {
        let passwords = localStorage.getItem("passwords")
        if (passwords) {
            setpasswordArray(JSON.parse(passwords))
        }
    }, [])

    const showPassword = () => {
        if (eyeRef.current.src.includes("/icons/eyecross.png")) {
            eyeRef.current.src = "/icons/eye.png"
            passRef.current.type = "password"
        }
        else {
            eyeRef.current.src = "/icons/eyecross.png"
            passRef.current.type = "text"
        }
    }

    const savePassword = async () => {
        if (!form.site || !form.username || !form.password) {
            toast.error("Please fill all fields!");
            return;
        }

        toast.success('Password Saved', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        // step78: now after step76 we now when clicking the save button , we are telling that : first delete the password whose id is in form.id ; that we had set in step76 : as when we clicked on EDIT ; that form got loaded into the input tags ; and before we click save again we want the old form to be deleted first , else it will still be there with old values and the updated password will be added as a new entry there.

        // step79: so using the deletion code we used in deletePassword function , we delete that form.id first  below ; where we sent the form.id as the "id" to be deleted in the delete function there in DELETE API of the Backend server there.

        // step81: also we can assign it like "let deleteRes" and not "let res" as its already being used in this funciton for the POST request below it ; so we may or may not do "let deleteRes" here : If we don’t need to check response, we can skip assigning; otherwise assign and handle errors like we did earlier in server4.js commented there to do like "if(!deleteRes.ok)" and all : ITS OPTIONAL.
        await fetch("https://pass-mern-backend.onrender.com" , {method:"DELETE" , headers :{"Content-Type" : "application/json"} , body : JSON.stringify( {id : form.id}) })

        // step80: after that when we click on save , the code of normal save happens and the editted password gets added there : SO OUR NEW UPADATED PASSWORD GETS ADDED AS A NEW FRESH ENTRY IN THE TABLE , AFTER THE PREVIOUS ONE WHOM WE WANTED TO EDIT GOT DELETED BY THE CODE WRITTEN ABOVE.

        // step81: thus we deleted the previous one on clicking edit ; and then saved the update entry as a new row there.

        const newEntry = { ...form, id: uuidv4() };
        const updatedArray = [...passwordArray, newEntry];
        setpasswordArray(updatedArray);

        // localStorage.setItem("passwords", JSON.stringify(updatedArray));

        // step54: now we comment the above lines which was saving the password in the localStorage and instead now try to save the password in our database server using the code below.

        // step55: so we now send a POST request to the server as we want to submit data to the server now.

        // step56: then we need to tell the server that the data is JSON : so need to give the below header as usual : Without this header, the server might not understand how to parse the incoming data properly.

        // step57: the body below is the actual data sent to the server in the POST request ; { ...form, id: uuidv4() } means : we create a new object with all the current properties in it like : site , username , password & then we append a unique id at end of it.

        // step58: JSON.stringify was done because : we cannot send objects in HTTP requests , but a string only ; and later seeing the header below , the server's body-parser parses it back to JSON to send in the req.body there.

        // step59: so what happens here is that : the POST API made in backend had code : const password = req.body;  Express parses JSON body automatically (with body-parser) & then using the code there : const findResult = await collection.insertOne(password); Inserts the password object into MongoDB database & then the server sends back the response of success: true and all written in the POST API in the backend folder there.
        let res = await fetch("https://pass-mern-backend.onrender.com" , {method:"POST" , headers :{"Content-Type" : "application/json"} , body : JSON.stringify({...form , id : uuidv4() }) })

        setform({ site: "", username: "", password: "" });
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        toast.info('Copied to Clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const editPassword = (id) => {
        // console.log("Editting password of id" + id)

        // setform(passwordArray.filter((item) => item.id === id)[0])
        // const updatedArray = passwordArray.filter((item) => item.id !== id)
        // setpasswordArray(updatedArray);

        // step75: so now we commented the above code and wrote a new code below -

        // step76: so we are using the below code to tell that : whenever our EDIT button is clicked : we are setting the "id" of the form to the "id" if the password that we want to edit : so below we are first getting the password object that matched the id of the password , whose "id" we clicked on & since it returns an array of object with that matching one object in it ; but "form" was an object not array of object ; so we need the object from that array of that one object ; which we access using the [0] indexing done below : after that we use "..." to set the form to an object that has the current values in it ; but we appended an id with value equal to the "id" of the password whose edit icon we clicked on ; as we had passed "id" as argument here , which was id of the edit icon we clicked on ; so using setform we updated the form state to be an object with the details of the password clciked on and we set its "id" to the password we clicked on to EDIT : thus we can delete it in the 78th step now ; AS WE WANT TO DELETE THE OLD VALUE JUST AS EDIT CLICKED ; AND WILL LATER SAVE THE UPDATED PASSWORD AS A NEW ENTRY IN THE TABLE THERE WHEN SAVE CLICKED AND THE AS USUAL SAVE_PASSWORD FUNCTION SAVES IT TO THE TABLE THERE NOW.
        setform({...passwordArray.filter(item => item.id === id)[0] , id : id})

        // step77: this done to : Remove the old password from the list (temporarily) like we did in the previous version of the passop too , where we did this to not show the password who we clicked to edit by filtering it out and not displaying it in the passwordArray now there ; but when refreshed comes back there ; so its temporarily happening / done here.
        setpasswordArray(passwordArray.filter(item => item.id !== id))
    }

    // step60: we updated the DELETE API first in server4.js there in backend , so see the next steps there first.
    const deletePassword = async(id) => {
        // console.log("Deleting password of id" + id)
        let c = confirm("Are you sure to delete this password ?")
        if (c) {
            const updatedArray = passwordArray.filter((item) => item.id !== id)
            setpasswordArray(updatedArray);

            // localStorage.setItem("passwords", JSON.stringify(updatedArray))

            // step72: so we commented the above line of code as now we dont want to use localStorage but mongoDB.

            // step73: we write the same code below as we wrote in savePassword ; but now method: DELETE ; so that it triggers the DELETE API in the backend file now.

            // step74: we have sent only the "id" passed as argument in this function i.e. the id of the form that was geenerated by uuid earlier : and we have also editted the delete API in server4.js file : so it now deletes the document that has this "id" there now.
            let res = await fetch("https://pass-mern-backend.onrender.com" , {method:"DELETE" , headers :{"Content-Type" : "application/json"} , body : JSON.stringify( {id}) })

            // step UNKNOWN_😁 : added line for error log if any : seen this syntax to be put in server4.js file there when we updated the DELETE API there.
            if(!res.ok){
                const errorData = await res.json();
                console.log(errorData.message)
            }

            toast.success("Password Deleted")
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className='md:mycontainer p-3 min-h-[86.2vh] md:w-full'>
                <h1 className="font-bold text-4xl text text-center">
                    <span className="text-green-700">&lt;/</span>
                    <span>Pass</span>
                    <span className="text-green-700">OP</span>
                    <span className="text-green-700">/&gt;</span>
                </h1>
                <p className='text-center text-green-900 text-lg'>Your own Password Manager</p>
                <div className='text-black flex flex-col p-4 gap-8 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 text-black w-full p-4 py-1' type="text" name="site" id="site" 

                    onKeyDown={(e) => {if(e.key === "Enter") {
                                        savePassword();
                                      }
                    }}
                    />

                    <div className='flex md:flex-row flex-col w-full justify-between gap-8'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 text-black w-full p-4 py-1' type="text" name="username" id="username" 
                        onKeyDown={(e) => {if(e.key === "Enter") {
                                        savePassword();
                                      }
                        }}
                        />

                        <div className="relative">
                            <input ref={passRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 text-black w-full p-4 py-1' type="password" name="password" id="password"
                            onKeyDown={(e) => {if(e.key === "Enter") {
                                        savePassword();
                                      }
                            }}
                            />

                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={eyeRef} className='p-1' width={26} src="/icons/eye.png" alt="" />
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='bg-green-600 hover:bg-green-500 rounded-full flex justify-center items-center px-8 py-2 w-fit gap-2 border-2 border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/efxgwrkc.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>
                </div>
                <div className="passwords">
                    <h2 className='text-2xl font-bold py-4'>Your Saved Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to display here</div>}
                    {passwordArray.length != 0 &&
                        <table className="table-auto width w-full overflow-hidden rounded-md mb-4">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className="flex justify-center items-center">
                                                <a href={item.site} target='_blank'>{item.site}</a>
                                                <div className='size-7 cursor-pointer' onClick={() => copyText(item.site)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/xuoapdes.json"
                                                        trigger="hover"
                                                        style={{ "width": "20px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center '>
                                            <div className="flex justify-center items-center">
                                                <span>{item.username}</span>
                                                <div className='size-7 cursor-pointer' onClick={() => copyText(item.username)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/xuoapdes.json"
                                                        trigger="hover"
                                                        style={{ "width": "20px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className="flex justify-center items-center">

                                                {/* <span>{item.password}</span> */}

                                                {/* step82: to hide the password when displayed we can use the ".repeat(x) property which repeats a character "x" times. */}

                                                {/* step83: so we comment out the above code for displaying the password and replaced with below one to show "*" as many times as the length of password there : HOWEVER IT WON'T AFFECT THE COPIED PASSSWORD AS BELOW WHEN WE CALL COPYTEXT FUNCTION ON CLICK IT COPIES ITEM.PASSWORD ONLY : SO PASSWORD WILL BE COPIED NOT "*" , SO NO NEED TO WORRY ABOUT THAT HERE NOW. 😊😁 */}
                                                <span>{"*".repeat(item.password.length)}</span>
                                                

                                                <div className='size-7 cursor-pointer' onClick={() => copyText(item.password)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/xuoapdes.json"
                                                        trigger="hover"
                                                        style={{ "width": "20px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/qawxkplz.json"
                                                    trigger="hover"
                                                    style={{ "width": "20px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                >
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/xyfswyxf.json"
                                                    trigger="hover"
                                                    style={{ "width": "20px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                >
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    )
}

export default Manager
