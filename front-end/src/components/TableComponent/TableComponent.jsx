import { Button, Divider, Dropdown, Radio, Space, Table } from 'antd'
import React, { useMemo, useState } from 'react'
import Loading from '../LoadingComponent/Loading';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Excel } from "antd-table-saveas-excel";

//export theo cach moi thi import 2 thu vien duoi
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const newColumnExport = useMemo(() => {
        const filter = columns?.filter((item) => item.dataIndex !== 'action')
        return filter
    }, [columns])
    // const [selectedRows, setSelectedRows] = useState([]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
            // setSelectedRows(selectedRows);
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //     name: record.name,
        // }),
    };

    // const items = [
    //     {
    //         key: '1',
    //         label: (
    //             <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
    //                 1st menu item
    //             </a>
    //         ),
    //     },
    //     {
    //         key: '2',
    //         label: (
    //             <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
    //                 2nd menu item (disabled)
    //             </a>
    //         ),
    //         disabled: true,
    //     },
    //     {
    //         key: '3',
    //         label: (
    //             <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
    //                 3rd menu item (disabled)
    //             </a>
    //         ),
    //         disabled: true,
    //     },
    //     {
    //         key: '4',
    //         danger: true,
    //         label: 'a danger item',
    //     },
    // ];
    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }

    //export excel theo cach moi nhat
    // const handleExportExcel = () => {
    //     // Chuyển dữ liệu thành dạng đơn giản, tránh export object phức tạp
    //     const exportData = (selectedRows.length > 0 ? selectedRows : data).map((item) => {
    //         const newItem = {};
    //         columns.forEach((col) => {
    //             if (typeof col.dataIndex === 'string') {
    //                 newItem[col.title] = item[col.dataIndex];
    //             }
    //         });
    //         return newItem;
    //     });

    //     const worksheet = XLSX.utils.json_to_sheet(exportData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    //     saveAs(dataBlob, "ExcelProducts.xlsx");
    // };

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("Sheet1")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true,
            })
            .saveAs("Excel.xlsx");
    }
    return (
        <Loading isLoading={isLoading}>
            {rowSelectedKeys.length > 0 && (
                <div style={{
                    background: '#1d1ddd',
                    color: '#fff',
                    fontSize: 'bold',
                    padding: '10px',
                    cursor: 'pointer'

                }}

                    onClick={handleDeleteAll}>
                    {/* <Dropdown menu={{ items }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Hover me
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown> */}
                    Xóa tất cả
                </div>
            )}
            <Button type="primary" onClick={exportExcel} style={{ marginBottom: '10px' }}>
                Export Excel
            </Button>

            {/* dung cach moi nhat de export excel */}
            {/* <Button type="primary" onClick={handleExportExcel} style={{ marginBottom: '10px' }}>
                Xuất Excel {selectedRows.length > 0 ? '(chỉ các dòng đã chọn)' : '(toàn bộ)'}
            </Button> */}

            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    )
}

export default TableComponent