import style from "./App.module.css"
import { useEffect, useState } from "react";

function App() {
  const [cep, setCep] = useState("81750-390");
  const [lat, setLat] = useState("-25.4248289");
  const [lng, setLng] = useState("-49.3548061");
  const [loading, setLoading] = useState(false);
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [estado, setEstado] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [regiao, setRegiao] = useState("") 
  const [ddd, setDdd] = useState("")
  const [ibge, setIbge] = useState("")


  function handleCep(e) {
    setCep(e.target.value);
  }

  useEffect(() => {
    const sanitizedCep = cep.replace(/\D/g, "");

    if (sanitizedCep.length !== 8) return;

    setLoading(true);

    fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          console.warn("CEP não encontrado");
          setLoading(false);
          return;
        }
        console.log(data)
        const { logradouro, localidade, uf, bairro, regiao, ddd, ibge } = data;
        setBairro(bairro);
        setRua(logradouro);
        setEstado(uf);
        setLocalidade(localidade);
        setRegiao(regiao)
        setDdd(ddd)
        setIbge(ibge)
        const address = `${logradouro ? logradouro + ", " : ""}${localidade}, ${uf}`;

        return fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
      })
      .then((response) => response.json())
      .then((LocationData) => {
        if (LocationData && LocationData.length > 0) {
          const { lat, lon } = LocationData[0];
          setLat(parseFloat(lat));
          setLng(parseFloat(lon));
        } else {
          console.log("coordenadas não encontradas");
        }
      })
      .catch((error) => {
        console.error("ERRO AO BUSCAR O CEP", error);
      })
        setLoading(false); 
  }, [cep]);

  return (
    <>
      <section>
        <div className={style.container}>
        <h2>API de Pesquisa de CEP</h2>
        <input type="text" placeholder="Insira o CEP:" value={cep} onChange={handleCep}/>
        <br />
        {bairro} - {rua} - {estado} - {localidade} - {regiao} - {ddd} - {ibge}
        </div>
        </section>
    </>
  )
}

export default App