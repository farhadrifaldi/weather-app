'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button, Dropdown, Flex, Layout, Space } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { ReactElement } from "react";
import Image from 'next/image';
import Logo from '@/assets/far_app_logo.png'

type props = {
    children: React.ReactNode;
}

function UserButton(): ReactElement {
    const { data: session } = useSession();
    const user = session?.user

    if (session) {
        return <Dropdown menu={{
            items: [{
                key: 0, label: (<Button type='link' onClick={() => {
                    signOut()
                }}>Logout</Button>), type: 'item'
            }]
        }} placement="bottomLeft">
            <Button type="link">
                {user?.email}
            </Button>
        </Dropdown>
    }
    return <Button type="link" href='/login'>
        Login
    </Button>
}

function BaseLayout({ children }: props): ReactElement {

    return <Layout style={{ height: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderBottom: 'solid 1px #ebebeb' }}>
            <Flex style={{ width: 768 }} justify="space-between" align='center' >
                <Image src={Logo} alt='Logo' height={60} />
                <UserButton />
            </Flex>
        </Header>
        <Content style={{ margin: '20px 0' }}>
            <Flex justify='center'>
                <Space style={{ width: 768 }} >
                    {children}
                </Space>
            </Flex>
        </Content>
    </Layout>
}

export { BaseLayout }