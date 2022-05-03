import { useState, useRef, useEffect } from "react";
import ApiUrls from "../../utils/ApiInvoker";
import { useNavigate } from "react-router-dom";

import Paginacion from "../uPaginacion";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";


export default function CEscenario() {
  const [escenario, setEscenario] = useState({
    nombre_escenario: "",
  });

  const [lista, setLista] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [adicionales, setAdicionales] = useState({})

  const labelGuardar = useRef();

  let browserHistory = useNavigate();

  useEffect(() => {
    ApiUrls.invokeGET(
      "/viewEscenario",
      (response) => {
        setLista(response.body);
        setOptions(response.adicionales);
      },
      (error) => {
        window.location = "/escenario";
      }
    );
  }, []);
  /* *********************** dual lists*/
  const onChangeDualList = (selected) => {
    setSelected(selected);
  };
  const estyleSelect = (id) => {
    const estilo = document.getElementById(id);
    estilo.className = "badge badge-danger right";
  };

  const handleInput = (e) => {
    let campo = e.target.name;
    let valor = e.target.value;
    setAdicionales({
      ...adicionales,
      [campo]: valor,
    });
  };

  //setea valores inciales valor_hora
  const seteoInicial = (a) =>{    
    setSelected(a)
    if(a.length>0){
      let aux={}
      for(const i in a){
        
        aux = {...aux, [a[i].value]: a[i].valor_hora}
      }
    
      setAdicionales(aux)
    }else{
      setAdicionales({})
    }
    
  }
  //valida no mbre

  const guardarDatos = (e) => {
    e.preventDefault();
    const label = labelGuardar.current;

    if (!escenario._id || selected.length<=0) {
      label.innerHTML = "no puede grabrar verifiqu su datos";
      return;
    }
    label.innerHTML = "";

    //estructura de datos
    

    if (escenario._id) {
      //guarda
      let request = {
        _id:escenario._id,
        adicionales: selected.map(i=>(
          {
            _id: i.value,
            valor_hora: adicionales[i.value]            
          }
        ))
      };
      
      //actualiza
      ApiUrls.invokePUT(
        "/updateEscenarioAdicionales",
        request,
        (res) => {
          if (res.ok) {
            ApiUrls.invokeGET(
              "/viewEscenario",
              (response) => {
                if(response.ok){
                  setEscenario({
                    nombre_escenario: "",
                  });
                  setLista(response.body);
                  setSelected([]);
                  setAdicionales({})
                }else{
                  label.innerHTML = response.mensaje
                }
              },
              (error) => {
                window.location = "/escenario";
              }
            );
          }
        },
        (err) => {
          console.error("error al actualizar perfil");
        }
      );
    } 
  };

  //************************** PAGINACION */
  const [paginaActual, setPaginaActual] = useState(1);
  //const [peliculas, setPeliculas] = useState([]);
  const PAGINABLOQUE = 5;

  let listaescenarioes = lista;
  //buscaPelicula();
  const cargarListaescenarioes = () => {
    listaescenarioes = listaescenarioes.slice(
      (paginaActual - 1) * PAGINABLOQUE,
      paginaActual * PAGINABLOQUE
    );
  };

  const getTotalPaginas = () => {
    let cantidadTotalescenarioes = lista.length;
    return Math.ceil(cantidadTotalescenarioes / PAGINABLOQUE);
  };

  cargarListaescenarioes();

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">
                  DDEA GAMEA <small>Escenario deportivos</small>
                </h3>
              </div>

              <form id="quickForm">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="nameLabel">
                      Nombre del Escenario deportivo:
                    </label>
                    <h4>{escenario.nombre_escenario}</h4>
                  </div>
                  {escenario.nombre_escenario ? (
                    <div className="form-group">
                      <label htmlFor="escenario">
                        Elija Items de costos adicionales al escenario
                      </label>
                      <DualListBox
                        options={options}
                        selected={selected}
                        onChange={onChangeDualList}
                        simpleValue={false}
                        className="form-select form-select-sm"
                      />
                    </div>
                  ) : null}

                  {(() => {
                    if (selected.length > 0)
                      return (
                        <div className="form-group">
                          <label htmlFor="cAdicional">
                            pongale valor a sus costos adicionales por item
                          </label>
                          
                          {selected.map(i=>(
                          <div className="form-group" key={i.value}>
                            <label htmlFor="nameLabel">
                              {i.label}
                            </label>
                            <input
                              type="Number"
                              value={adicionales[i.value]}
                              placeholder="0.00 Bs"
                              name={i.value}
                              className="form-control"
                              id={i.value}
                              onChange={handleInput}
                            />
                          </div>
                          ))}
                        </div>
                      );
                  })()}
                </div>

                <div className="card-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={guardarDatos}
                  >
                    Submit
                  </button>

                  <label
                    ref={labelGuardar}
                    id="submitBtnLabel"
                    htmlFor="submitBtn"
                    className="right badge badge-danger "
                  ></label>
                </div>
              </form>
            </div>
          </div>

          <div className="col-md-6">
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">
                          Lista de tipo escenarioes
                        </h3>
                      </div>

                      <div className="card-body">
                        <table
                          id="example2"
                          className="table table-bordered table-hover"
                        >
                          <thead>
                            <tr>
                              <th>Clave</th>
                              <th>nombre</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listaescenarioes.map((i) => (
                              <tr key={i.nombre_escenario}>
                                <td>
                                  <a
                                    href="#"
                                    className="badge badge-warning"
                                    id={i.nombre_escenario}
                                    onClick={() => {
                                      estyleSelect(i.nombre_escenario);
                                      setEscenario(i);                                      
                                      seteoInicial(i.adicionales);
                                    }}
                                  >
                                    {i.nombre_escenario}
                                  </a>
                                </td>
                                <td>{i.nombre_escenario}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colSpan="2">
                                <Paginacion
                                  pagina={paginaActual}
                                  total={getTotalPaginas()}
                                  cambioPage={(pagina) => {
                                    setEscenario({
                                      nombre_escenario: "",
                                    });
                                    setPaginaActual(pagina);
                                    setSelected([]);
                                  }}
                                />
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
