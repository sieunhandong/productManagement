import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Checkbox, Form, Input, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../utils'
import { UploadOutlined } from '@ant-design/icons'
import * as ProductService from '../../services/ProductService'
import { useMutatioHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useForm } from 'antd/es/form/Form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DrawerComponent } from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import { ModalComponent } from '../ModalComponent/ModalComponent'
export const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state.user);
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: ''
    })
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: ''
    })

    const [form] = useForm();
    const mutation = useMutatioHooks(
        (data) => {
            const { name,
                price,
                description,
                rating,
                image,
                type,
                countInStock: countInStock } = data
            const res = ProductService.createProduct(data);
            return res;
        }
    )
    console.log('rowSelected', rowSelected)
    const mutationUpdate = useMutatioHooks(
        (data) => {
            const {
                id,
                token,
                ...rests } = data
            console.log('token', token)
            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests }
            );
            return res;
        }
    )
    const mutationDeleted = useMutatioHooks(
        (data) => {
            const {
                id,
                token } = data
            console.log('token', token)
            const res = ProductService.deleteProduct(
                id,
                token
            );
            return res;
        }
    )
    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }
    const getProductDetails = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock
            })
        }
        setIsLoadingUpdate(false)
    }
    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])
    // console.log('stateProductDetails', stateProductDetails)
    useEffect(() => {
        if (rowSelected) {
            setIsLoadingUpdate(true)
            getProductDetails(rowSelected)
        }
    }, [rowSelected])
    const handleDetailsProduct = () => {
        setIsDrawerOpen(true)
    }

    const { data, isPending, isSuccess, isError } = mutation
    const { data: dataUpdate, isPending: isLoadingUpdated, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate
    const { data: dataDeleted, isPending: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
    const { isLoading: isLoadingProduct, data: products } = queryProduct
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
            </div>
        )
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product,
            key: product._id
        }
    })

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])
    useEffect(() => {
        if (isSuccessUpdate && dataUpdate?.status === 'OK') {
            message.success()
            handleCloseDrawer()
            // queryClient.invalidateQueries(['products']);
        } else if (isErrorUpdate) {
            message.error()
        }
    }, [isSuccessUpdate])
    const onFinish = () => {
        setIsSigningIn(true);
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        setIsSigningIn(false);
    }
    // const handleOk = () => {
    //     onFinish()
    // }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
        setIsModalOpenDelete(false)
    }
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false)
        setStateProductDetails({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: ''
        })
        form.resetFields()
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: ''
        })
        form.resetFields()
    }
    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
        console.log("e.target.value", e.target.name, e.target.value)
    }
    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
        console.log("e.target.value", e.target.name, e.target.value)
    }
    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList?.[0];

        if (!file) return;

        let preview = file.url;

        if (!preview && file.originFileObj) {
            preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: preview
        })
    };
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList?.[0];

        if (!file) return;

        let preview = file.url;

        if (!preview && file.originFileObj) {
            preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: preview
        })
    };
    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }
    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '40px' }} /></Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingProduct}
                    data={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        }
                    }}
                />
            </div>
            <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isPending} >
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type" />
                        </Form.Item>
                        <Form.Item
                            label="Count in stock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />

                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your count price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />

                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your count description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />

                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your count rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />

                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your count image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatar}
                                maxCount={1}
                                beforeUpload={() => false} // để không upload lên server ngay
                                showUploadList={false} // ẩn danh sách file nếu muốn
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                                {stateProduct.image && (
                                    <img src={stateProduct?.image} alt="avatar"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px'
                                        }}
                                    />)}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} width={600} >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated} >
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        // style={{ maxWidth: 600 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProductDetails.name} onChange={handleOnChangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name="type" />
                        </Form.Item>
                        <Form.Item
                            label="Count in stock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name="countInStock" />

                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your count price!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price" />

                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your count description!' }]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleOnChangeDetails} name="description" />

                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your count rating!' }]}
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleOnChangeDetails} name="rating" />

                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your count image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails}
                                maxCount={1}
                                beforeUpload={() => false} // để không upload lên server ngay
                                showUploadList={false} // ẩn danh sách file nếu muốn
                            >
                                <Button icon={<UploadOutlined />}>Select File</Button>
                                {stateProductDetails.image && (
                                    <img src={stateProductDetails?.image} alt="avatar"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px'
                                        }}
                                    />)}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isLoading={isLoadingDeleted} >
                    <div>Bạn có chắc xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}
