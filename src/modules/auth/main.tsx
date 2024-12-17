'use client'

import { App, Button, Flex, Form, Input, Typography } from "antd";
import { FormNames, FormTypes } from "./types/form";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const FormLabel = {
    [FormNames.email]: 'Email',
    [FormNames.password]: 'Password'
}


export function Main() {
    const navigation = useRouter()
    const [isLogin, setIsLogin] = useState(true);

    const haveAccountText = isLogin ? "Don't have an account? Register!" : "Already have an account? Log in!";
    const title = isLogin ? "LOGIN" : "REGISTER";

    const { notification } = App.useApp();

    function toggleMode() {
        setIsLogin(!isLogin);
    }

    function onFinish(values: FormTypes) {
        if (isLogin) {
            login(values)
        } else {
            register(values)
        }
    }

    function login(values: FormTypes) {
        signIn("credentials", { email: values[FormNames.email], password: values[FormNames.password], redirect: false })
            .then((response): void => {
                if (response?.error && response.error === 'CredentialsSignin') {
                    notification.error({ message: 'Wrong combination of email and password' })
                } else if (response?.error && response.error !== 'credentialSignin') {
                    notification.error({ message: response.error })
                } else {
                    notification.success({ message: "Login success, you will be redirected" })
                    navigation.push('/')
                }
            }).catch((e) => {
                notification.error({ message: e.message })
            })
    }

    async function register(values: FormTypes) {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: values.email, password: values.password }),
        });

        const data = await res.json();

        if (res.ok) {
            notification.success({
                message: 'Registration successful',
            })
        } else {
            notification.error({ message: data.error })
        }
    }

    const { data: session } = useSession()

    console.log(session)
    if (session) {
        return <p>You are logged, welcome!</p>
    }



    return (
        <Flex justify="center" align="center" style={{ height: "100vh", margin: "0 auto" }}>
            <Form onFinish={onFinish} layout="vertical" style={{ width: 700, }}>
                <Typography.Title level={2}>{title}</Typography.Title>
                <Form.Item name={FormNames.email} label={FormLabel[FormNames.email]}>
                    <Input />
                </Form.Item>
                <Form.Item name={FormNames.password} label={FormLabel[FormNames.password]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" style={{ width: "100%" }} htmlType="submit">{title}</Button>
                <Button type="link" style={{ padding: 0 }} onClick={toggleMode}>{haveAccountText}</Button>
            </Form>
        </Flex>
    );
}



