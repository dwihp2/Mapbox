import React, {useEffect} from "react";
import {View, Text, TouchableOpacity, Button} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import * as yup from 'yup';
import CostumTextInput from '../components/CostumTextInput';
import navigationServices from '../helper/navigationServices';
import Loading from '../components/Loading';
import firebase from '../helper/Firebase_Config';

const validateFormik = yup.object().shape({
    email:yup
        .string()
        .email()
        .required(),
    password: yup
        .string()
        .required()
        .min(6)
});

const FormLogin = () => {
    useEffect (()=> {
        console.log("didmount or didupdate FormLogin");
        return () => {
            console.log("unmount FormLogin");
        };
    }, []);
    
    _doLogin = ({email, password}) => {
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                try {
                    firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((res)=> {
                        console.warn(res.user.email);
                        resolve (true)                    
                    })
                    .catch ((error) =>{
                        alert (error)
                        reject (true)
                    })
                } catch (error) {
                    console.warn(error.toString(error))
                }
            }, 2000);
        });
    };
    
    return(
        <Formik
            initialValues = {{
                email:"",
                password:""
            }}
            onSubmit={(values, actions) => {
                _doLogin({email:values.email, password:values.password})
                .then( async()=> {
                    const userData = {email:values.email}
                    try{
                        console.warn(values.password)
                        await AsyncStorage.setItem("@EMAIL",JSON.stringify(userData));
                        navigationServices.navigate("DASHBOARD");
                    }catch(e) {
                        alert(e)
                    }
                })
                .catch(e => (e.message))
                .finally(()=> actions.setSubmitting(false));
            }}
            validationSchema={validateFormik}
        >
            {formikProps => (
                <>
                    <CostumTextInput
                        label="Email"
                        nameTxtInput="email"
                        keyboardType="email-address"
                        formikProps={formikProps}
                    />
                    <CostumTextInput
                        label="Password"
                        nameTxtInput="password"
                        secureTextEntry
                        formikProps={formikProps}
                    />

                    {formikProps.isSubmitting && <Loading/>}
                    <View style = {{marginVertical:10}}>
                        <Button
                            title="LOGIN"
                            onPress={formikProps.handleSubmit}
                        />                        
                    </View>
                    <View style = {{flexDirection:"row", justifyContent:"space-between"}}>
                        <TouchableOpacity
                            onPress= {()=> navigationServices.navigate('RESETPASSWORD')}>

                                <Text
                                    style = {{color:"steelblue", fontSize:16, fontStyle:"italic"}}
                                >{'Lupa Password ?'}</Text>

                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={() => navigationServices.navigate("REGISTER")}>

                                <Text
                                    style={{color:"steelblue", fontSize:16, fontStyle:"italic"}}
                                    >{'Register'}
                                </Text>

                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Formik>
    );
};

export default FormLogin;