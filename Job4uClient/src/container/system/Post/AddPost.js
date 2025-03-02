import React from 'react'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/input/DatePicker';
import { createPostService, updatePostService, getDetailPostByIdService } from '../../../service/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { useFetchAllcode } from '../../../util/fetch';
import { useParams } from "react-router-dom";
import { Spinner, Modal } from 'reactstrap'
import localization from 'moment/locale/vi';
import moment from 'moment';
import '../../../components/modal/modal.css'
const AddPost = () => {
    const mdParser = new MarkdownIt();
    const [user, setUser] = useState({})
    const [timeEnd, settimeEnd] = useState('');
    const [isChangeDate, setisChangeDate] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        name: '', category_job_id: '', address_id: '', salary_job_id: '', amount: '', time_end: '', category_joblevel_id: '', category_worktype_id: '', experience_job_id: '',
        genderId: '', descriptionHTML: '', descriptionMarkdown: '', isActionADD: true, id: ''
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (id) {
            fetchPost(id)
        }
        setUser(userData)
    }, [])
    let fetchPost = async (id) => {
        let res = await getDetailPostByIdService(id)
        if (res && res.errCode === 0) {
            setStatePost(res.data)
        }
    }
    let setStatePost = (data) => {
        setInputValues({
            ...inputValues,
            ["name"]: data.name,
            ["category_job_id"]: data.category_job_id,
            ["address_id"]: data.address_id,
            ["salary_job_id"]: data.salary_job_id,
            ["amount"]: data.amount,
            ["time_end"]: data.time_end,
            ["category_joblevel_id"]: data.category_joblevel_id,
            ["category_worktype_id"]: data.category_worktype_id,
            ["experience_job_id"]: data.experience_job_id,
            ["genderId"]: data.genderPostCode,
            ["descriptionHTML"]: data.descriptionHTML,
            ["descriptionMarkdown"]: data.descriptionMarkdown,
            ["isActionADD"]: false,
            ["id"]: data.id

        })
        settimeEnd(moment.unix(+data.time_end / 1000).locale('vi').format('DD/MM/YYYY'))
    }


    const { data: dataGenderPost } = useFetchAllcode('GENDERPOST');
    const { data: dataJobType } = useFetchAllcode('JOBTYPE');
    const { data: dataJobLevel } = useFetchAllcode('JOBLEVEL');
    const { data: dataSalaryType } = useFetchAllcode('SALARYTYPE');
    const { data: dataExpType } = useFetchAllcode('EXPTYPE');
    const { data: dataWorkType } = useFetchAllcode('WORKTYPE');
    const { data: dataProvince } = useFetchAllcode('PROVINCE');

    if (dataGenderPost && dataGenderPost.length > 0 && inputValues.genderId === '' && dataJobType && dataJobType.length > 0 && inputValues.category_job_id === '' && dataJobLevel && dataJobLevel.length > 0 && inputValues.category_joblevel_id === '' &&
        dataSalaryType && dataSalaryType.length > 0 && inputValues.salary_job_id === '' && dataExpType && dataExpType.length > 0 && inputValues.experience_job_id === '' &&
        dataWorkType && dataWorkType.length > 0 && inputValues.category_worktype_id === '' && dataProvince && dataProvince.length > 0 && inputValues.address_id === ''
    ) {

        setInputValues({
            ...inputValues, ["genderId"]: dataGenderPost[0].code, ["category_job_id"]: dataJobType[0].code,
            ["category_joblevel_id"]: dataJobLevel[0].code, ["salary_job_id"]: dataSalaryType[0].code, ["experience_job_id"]: dataExpType[0].code,
            ["category_worktype_id"]: dataWorkType[0].code
        })
    }
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };


    let handleEditorChange = ({ html, text }) => {
        setInputValues({
            ...inputValues,
            ["descriptionMarkdown"]: text,
            ["descriptionHTML"]: html
        })
    }
    let handleOnChangeDatePicker = (date) => {
        settimeEnd(date[0])
        setisChangeDate(true)

    }
    let handleSavePost = async () => {
        setIsLoading(true)
        if (inputValues.isActionADD === true) {
            let res = await createPostService({
                name: inputValues.name,
                descriptionHTML: inputValues.descriptionHTML,
                descriptionMarkdown: inputValues.descriptionMarkdown,
                category_job_id: inputValues.category_job_id,
                address_id: inputValues.address_id,
                salary_job_id: inputValues.salary_job_id,
                amount: inputValues.amount,
                time_end: new Date(timeEnd).getTime(),
                category_joblevel_id: inputValues.category_joblevel_id,
                category_worktype_id: inputValues.category_worktype_id,
                experience_job_id: inputValues.experience_job_id,
                genderId: inputValues.genderId,
                companyId: user.company_id,

            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success("Thêm mới bài đăng thành công")
                    setInputValues({
                        ...inputValues,
                        ["name"]: '',
                        ["descriptionHTML"]: '',
                        ["descriptionMarkdown"]: '',
                        ["category_job_id"]: '',
                        ["address_id"]: '',
                        ["salary_job_id"]: '',
                        ["amount"]: '',
                        ["time_end"]: '',
                        ["category_joblevel_id"]: '',
                        ["category_worktype_id"]: '',
                        ["experience_job_id"]: '',
                        ["genderId"]: '',

                    })
                    settimeEnd('')
                } else {
                    toast.error(res.errMessage)
                }
            }, 1000);
        } else {
            let res = await updatePostService({
                name: inputValues.name,
                descriptionHTML: inputValues.descriptionHTML,
                descriptionMarkdown: inputValues.descriptionMarkdown,
                category_job_id: inputValues.category_job_id,
                address_id: inputValues.address_id,
                salary_job_id: inputValues.salary_job_id,
                amount: inputValues.amount,
                time_end: isChangeDate === false ? inputValues.time_end : new Date(timeEnd).getTime(),
                category_joblevel_id: inputValues.category_joblevel_id,
                category_worktype_id: inputValues.category_worktype_id,
                experience_job_id: inputValues.experience_job_id,
                genderId: inputValues.genderId,
                id: inputValues.id
            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success("Cập nhật bài đăng thành công")

                } else {
                    toast.error(res.errMessage)
                }
            }, 1000);
        }
    }
    return (
        <>
            <div className=''>
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">{inputValues.isActionADD === true ? 'Thêm mới bài đăng' : 'Cập nhật bài đăng'}</h4>
                            <br></br>
                            <form className="form-sample">

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Tên bài đăng</label>
                                            <div className="col-sm-9">
                                                <input value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} type="text" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Địa chỉ</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.address_id} name="address_id" onChange={(event) => handleOnChange(event)}>
                                                    {dataProvince && dataProvince.length > 0 &&
                                                        dataProvince.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">SL nhân viên</label>
                                            <div className="col-sm-9">
                                                <input value={inputValues.amount} name="amount" onChange={(event) => handleOnChange(event)} type="number" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Thời gian KT</label>
                                            <div className="col-sm-9">
                                                <DatePicker className="form-control" onChange={handleOnChangeDatePicker}
                                                    value={timeEnd}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Giới tính</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.genderId} name="genderId" onChange={(event) => handleOnChange(event)}>
                                                    {dataGenderPost && dataGenderPost.length > 0 &&
                                                        dataGenderPost.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Kinh nghiệm</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.experience_job_id} name="experience_job_id" onChange={(event) => handleOnChange(event)}>
                                                    {dataExpType && dataExpType.length > 0 &&
                                                        dataExpType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Ngành</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.category_job_id} name="category_job_id" onChange={(event) => handleOnChange(event)}>
                                                    {dataJobType && dataJobType.length > 0 &&
                                                        dataJobType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Chức vụ</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.category_joblevel_id} name="category_joblevel_id" onChange={(event) => handleOnChange(event)}>
                                                    {dataJobLevel && dataJobLevel.length > 0 &&
                                                        dataJobLevel.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Lương</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.salary_job_id} name="salary_job_id" onChange={(event) => handleOnChange(event)}>
                                                    {dataSalaryType && dataSalaryType.length > 0 &&
                                                        dataSalaryType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group row">
                                            <label className="col-sm-3 col-form-label">Hình thức LV</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={inputValues.category_worktype_id} name="category_worktype_id" onChange={(event) => handleOnChange(event)}>
                                                    {dataWorkType && dataWorkType.length > 0 &&
                                                        dataWorkType.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.code}>{item.value}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="form-label">Mô tả công việc</label>
                                        <div className="form-group">

                                            <MdEditor
                                                style={{ height: '500px' }}
                                                renderHTML={text => mdParser.render(text)}
                                                onChange={handleEditorChange}
                                                value={inputValues.descriptionMarkdown}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <button onClick={() => handleSavePost()} type="button" className="btn1 btn1-primary1 btn1-icon-text">
                                    <i class="ti-file btn1-icon-prepend"></i>
                                    Lưu
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading &&
                <Modal isOpen='true' centered contentClassName='closeBorder' >

                    <div style={{
                        position: 'absolute', right: '50%',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Spinner animation="border"  ></Spinner>
                    </div>

                </Modal>
            }
        </>
    )
}

export default AddPost
