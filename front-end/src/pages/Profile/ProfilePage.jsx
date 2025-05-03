import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperUploadFile, WrapprerLabel } from './style'
import InputFormComponent from '../../components/InputFormComponent/InputFormComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutatioHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [avatar, setAvatar] = useState('');

    const dispatch = useDispatch();
    const mutation = useMutatioHooks(
        async (data) => {
            const { id, access_token, ...rests } = data
            const res = await UserService.updateUser(id, access_token, rests);
            return { ...res.data, access_token };
        }
    )

    const { data, isPending, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email);
        setName(user?.name);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success("Cập nhật thành công!");
            handleGetDetailsUser(user?.id, data?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
        console.log('res', res)
    }
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangeName = (value) => {
        setName(value)
    }
    const handleOnchangePhone = (value) => {
        setPhone(value)
    }
    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList?.[0];

        if (!file) return;

        let preview = file.url;

        if (!preview && file.originFileObj) {
            preview = await getBase64(file.originFileObj);
        }

        setAvatar(preview);
    };

    //tai anh len server
    // const handleOnchangeAvatar = async ({ fileList }) => {
    //     const file = fileList?.[0]?.originFileObj;

    //     if (!file) return;

    //     try {
    //         const res = await UserService.uploadAvatar(file);
    //         setAvatar(res.url); // URL ảnh từ server
    //     } catch (err) {
    //         message.error('Upload avatar failed!');
    //     }
    // };

    const handleUpdate = () => {

        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token }
        )
    }
    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thong tin nguoi dung</WrapperHeader>
            <Loading isLoading={isPending}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapprerLabel htmlFor="name">Name</WrapprerLabel>
                        <InputFormComponent style={{ width: '300px' }} id="name" value={name} onChange={handleOnchangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '4px 6px',
                            }}
                            textButton={'Cap nhat'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapprerLabel htmlFor="email">Email</WrapprerLabel>
                        <InputFormComponent style={{ width: '300px' }} id="email" value={email} onChange={handleOnchangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '4px 6px',
                            }}
                            textButton={'Cap nhat'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapprerLabel htmlFor="phone">Phone</WrapprerLabel>
                        <InputFormComponent style={{ width: '300px' }} id="phone" value={phone} onChange={handleOnchangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '4px 6px',
                            }}
                            textButton={'Cap nhat'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapprerLabel htmlFor="address">Address</WrapprerLabel>
                        <InputFormComponent style={{ width: '300px' }} id="address" value={address} onChange={handleOnchangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '4px 6px',
                            }}
                            textButton={'Cap nhat'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapprerLabel htmlFor="avatar">Avatar</WrapprerLabel>
                        <WrapperUploadFile onChange={handleOnchangeAvatar}
                            maxCount={1}
                            beforeUpload={() => false} // để không upload lên server ngay
                            showUploadList={false} // ẩn danh sách file nếu muốn
                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} alt="avatar"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />)}
                        {/* <InputFormComponent style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '4px 6px',
                            }}
                            textButton={'Cap nhat'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>

        </div>
    )
}

export default ProfilePage