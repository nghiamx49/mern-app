import React, { useState, useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import InputField from './InputField';

import Button from './Button';


const LoginForm = () => {
    const [account, setAccount] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (errors.username !== '' || errors.password !== '' || account.username === '' || account.password === '') {
            setDisable(true);
        }
        else {
            setDisable(false);
        }
    }, [errors.username, errors.password, account.username, account.password]);

    const handleTextInput = (text, name, label) => {
        switch (name) {
            // case 'propertyType':
            // case 'bedRoom':
            case 'username':
            case 'password':
                if (text === '') {
                    setErrors({ ...errors, [name]: `${label} must be filled` });
                } else {
                    setErrors({ ...errors, [name]: '' });
                    setAccount({ ...account, [name]: text });
                }
                break;
            default:
                setAccount({ ...account, [name]: text });
                break;
        }
    };

    return (
        <View style={styles.form}>
            <InputField
                name="username"
                handleTextInput={handleTextInput}
                label="Username"
                value={account.username}
                error={errors.username}
                icon={'person-sharp'}
                isRequired
            />
            <InputField
                name="pasword"
                handleTextInput={handleTextInput}
                label="Password"
                value={account.password}
                error={errors.password}
                icon={'key-sharp'}
                isRequired
                secureTextEntry={true}
            />
            <Button disable={disable} />
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default LoginForm;
