import React, {useEffect, useRef, useState} from 'react';
import Modal from "./Modal/Modal.jsx";
import axiosInstace from "./util/util.js";
import {useAuth} from "./authentication/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    const [modal, setModal] = useState(false)
    const formRef = useRef(null)
    const [produtos, setProdutos] = useState([])
    const [modalpay, setModalPay] = useState(false)
    const [idDelete, setIdDelete] = useState([])
    const [modaledit, setModalEdit] = useState(false)
    const [idedit, setIdEdit] = useState([])

    const {logout} = useAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        axiosInstace.get('/produto').then(response=>{
            setProdutos(response.data)
        })
    },[])
    const openModal = ()=>{
        setModal(true)
    }
    const closeModal = ()=>{
        setModal(false)
    }

    const deslogar = ()=>{
        logout();
        navigate("/login")
    }

    const submitForm = (e)=>{
        e.preventDefault()

        axiosInstace.post("/produto",{comprador: formRef.current.nome.value, produto: formRef.current.produto.value, quantidade: formRef.current.quantidade.value, valor: formRef.current.valor.value}).then(response=>{
            setModal(false)
            setProdutos(p=>[...p, response.data])
        })
    }

    const openModalPay = (id)=>{
        setIdDelete(id)
        setModalPay(true)
    }
    const closeModalPay = ()=>setModalPay(false)
    const deletar = (id)=>{
        axiosInstace.delete(`/produto/${id}`).then(()=>{
            setModalPay(false)
            setProdutos(prevState=>prevState.filter(p=>p.id!=id))
        })
    }

    const openModalEdit = (produto)=>{
        setIdEdit(produto)
        setModalEdit(true)
    }
    const closeModalEdit = ()=>setModalEdit(false)

    const submitEditForm = (e, id)=>{
        e.preventDefault()
        axiosInstace.put(`/produto/${id}`, {comprador: formRef.current.nome.value, produto: formRef.current.produto.value, quantidade: formRef.current.quantidade.value, valor: formRef.current.valor.value}).then(response=>{
            console.log("Produto atualizado:", response.data); // Adicione este log

            setProdutos(prevProdutos => {
                return prevProdutos.map(produto =>
                    produto.id === id ? { ...response.data } : produto
                );
            });
            closeModalEdit();
        })
    }
    return (
        <>
            <Modal isOpen={modal} isClosed={closeModal}>
                <form action="" ref={formRef} onSubmit={submitForm} className={"flex flex-col justify-center gap-2"}>
                    <label htmlFor="" className={"flex justify-center text-black font-bold"}>Comprador:</label>
                    <input type="text" name="nome" id="" className={"border border-gray-300 rounded"}/>

                    <label htmlFor="" className={"text-black font-bold"}>Produto:</label>
                    <input type="text" name="produto" id="" className={"border border-gray-300 rounded"}/>

                    <label htmlFor="" className={"text-black font-bold"}>Quantidade</label>
                    <input type="number" name="quantidade" className={"border border-gray-300 rounded"}/>

                    <label htmlFor="" className={"text-black font-bold"}>Valor:</label>
                    <input type="number" name="valor" id="" className={"border border-gray-300 rounded"}/>
                    <div className={"flex justify-end mt-2"}>
                        <button type="submit" className={"bg-blue-600 text-white font-bold rounded p-2"}>Enviar</button>
                    </div>
                </form>
            </Modal>
            <Modal isOpen={modalpay} isClosed={closeModalPay}>
                <h2 className={"font-bold text-center p-6"}>Tem certeza que deseja excluir este registro?</h2>
                <button className={"bg-red-500 text-white font-bold p-2 rounded"} onClick={closeModalPay}>Cancelar
                </button>
                <button className={"bg-green-500 text-white font-bold p-2 rounded ml-2"}
                        onClick={() => deletar(idDelete)}>Confirmar
                </button>
            </Modal>

            <Modal isOpen={modaledit} isClosed={closeModalEdit}>
                <form action="" ref={formRef} onSubmit={(e) => submitEditForm(e, idedit.id)}
                      className={"flex flex-col justify-center gap-2"}>
                    <label htmlFor="" className={"flex justify-center text-black font-bold"}>Comprador:</label>
                    <input type="text" name="nome" id="" className={"border border-gray-300 rounded"}
                           defaultValue={idedit.comprador}/>

                    <label htmlFor="" className={"text-black font-bold"}>Produto:</label>
                    <input type="text" name="produto" id="" className={"border border-gray-300 rounded"}
                           defaultValue={idedit.produto}/>

                    <label htmlFor="" className={"text-black font-bold"}>Quantidade</label>
                    <input type="number" name="quantidade" className={"border border-gray-300 rounded"}
                           defaultValue={idedit.quantidade}/>

                    <label htmlFor="" className={"text-black font-bold"}>Valor:</label>
                    <input type="number" name="valor" id="" className={"border border-gray-300 rounded"}
                           defaultValue={idedit.valor}/>
                    <div className={"flex justify-end mt-2"}>
                        <button type="submit" className={"bg-blue-600 text-white font-bold rounded p-2"}>Editar</button>
                    </div>
                </form>
            </Modal>
            <div className={"flex justify-between items-start"}>
                <div>
                    <button className={"flex items-center"} onClick={deslogar}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="mr-2"/>
                        Logout
                    </button>
                </div>
                <div className={"w-3/12"}>
                    <button className={"bg-green-500 text-white font-bold w-full p-2 rounded"} onClick={openModal}>
                        Criar Registro
                    </button>
                </div>
            </div>


            <div className="container mx-auto mt-10">
                <div className="overflow-x-auto">
                    <table className="min-w-full hidden md:table bg-white border border-gray-200 rounded-lg shadow-lg">
                        <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-3 px-4 text-center">Nome</th>
                            <th className="py-3 px-4 text-center">Produto</th>
                            <th className="py-3 px-4 text-center">Quantidade</th>
                            <th className="py-3 px-4 text-center">Valor</th>
                            <th className="py-3 px-4 text-center">Editar</th>
                            <th className="py-3 px-4 text-center">Pago</th>
                        </tr>
                        </thead>
                        <tbody>
                        {produtos.map((produto, index) => (
                            <tr key={index} className="hover:bg-gray-100 border-b">
                                <td className="py-2 px-4">{produto.comprador}</td>
                                <td className="py-2 px-4">{produto.produto}</td>
                                <td className="py-2 px-4">{produto.quantidade}</td>
                                <td className="py-2 px-4">{produto.valor}</td>
                                <td className="py-2 px-4">
                                    <button className="bg-blue-600 text-white font-bold p-2 rounded"
                                            onClick={() => openModalEdit(produto)}>Editar
                                    </button>
                                </td>
                                <td className="py-2 px-4">
                                    <button className="bg-red-500 text-white font-bold p-2 rounded"
                                            onClick={() => openModalPay(produto.id)}>Pago
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Responsividade para mobile */}
                    <div className="md:hidden">
                        {produtos.map((produto, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow">
                                <h3 className="font-bold">{produto.produto}</h3>
                                <p><strong>Nome:</strong> {produto.comprador}</p>
                                <p><strong>Quantidade:</strong> {produto.quantidade}</p>
                                <p><strong>Valor:</strong> {produto.valor}</p>
                                <div className="flex justify-between mt-2">
                                    <button className="bg-blue-600 text-white font-bold p-2 rounded"
                                            onClick={() => openModalEdit(produto)}>Editar
                                    </button>
                                    <button className="bg-red-500 text-white font-bold p-2 rounded"
                                            onClick={() => openModalPay(produto.id)}>Pago
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;