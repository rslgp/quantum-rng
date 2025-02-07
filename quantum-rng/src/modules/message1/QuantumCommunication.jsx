import React from 'react';
import { Box, Typography, Grid2, List, ListItem, Link } from '@mui/material';
import './QuantumCommunication.css';  // Import the CSS file

const QuantumCommunication = () => {
  return (
    <Box className="quantum-communication">
      <Grid2 container spacing={2}>
        {/* Science Panel */}
        <Grid2 item xs={12} sm={6} md={3}>
          <Box className="panel">
            <Typography variant="h6" className="section-title">
              Ciência
            </Typography>
            <Typography className="content-text">
              A parte de ciência é de uma pesquisa em física quântica na Austrália, onde eles não conseguem intervir no resultado.
              <br />
              Base científica: Flutuações no vácuo na física quântica existem partículas virtuais aparecendo e desaparecendo.
              <br />
            </Typography>
            <List className="references-list">
            Publicações de física usadas como base:
              <ListItem>
                <Link href="https://dx.doi.org/10.1063/1.3597793" target="_blank" rel="noopener noreferrer"> Appl. Phys. Lett. 98, 231103 (2011)</Link>
              </ListItem>
              <ListItem>
                <Link href="https://dx.doi.org/10.1103/PhysRevApplied.3.054004" target="_blank" rel="noopener noreferrer"> Phys. Rev. Applied 3, 054004 (2015)</Link>
              </ListItem>
            </List>
          </Box>
        </Grid2>

        {/* Tech Panel */}
        <Grid2 item xs={12} sm={6} md={3}>
          <Box className="panel">
            <Typography variant="h6" className="section-title">
              Tecnologia
            </Typography>
            <Typography className="content-text">
              Esta tecnologia mantém a não interferência dos humanos. Eu apenas faço a visualização dos dados e sigo um padrão de comunicação.
              <br />
              Não capturo voz. É possível usar tanto mentalizando/pensando a pergunta quanto verbalizando.
            </Typography>

            {/* Communication Model */}
            <Typography variant="h5" className="model-title">
              Modelo de Comunicação
            </Typography>
            <Typography className="model-paragraph">
              A tecnologia segue um padrão de padrao de comunicacao analise qualitativa com escala de 5 niveis.
            </Typography>
              
              
            <Typography><b>Passo 1:</b> 0 a 100, convertidos em 5 níveis</Typography>
            <Typography>Não absoluto, Parcialmente não, 
              <br/>
              Neutro (arbítrio), 
              <br/>
              Parcialmente sim, Sim absoluto.</Typography>
            

            <Typography className="model-paragraph">
              Esse padrão foi escolhido com base em uma experiência única que vivenciei.
            </Typography>

            <Typography className="model-paragraph">
              O passo 1 é feita por 3 vezes, e no final, para simplificar, (Passo 2) converte-se para três opções: negativo, neutro, positivo.
            </Typography>

            <Typography className="model-paragraph">
              O resultado final é determinado pela maioria dos resultados do passo 1, e a interpretação do resultado deve ser feita de acordo com o arbítrio independente do resultado obtido.
            </Typography>
          </Box>
        </Grid2>

        {/* Faith Panel */}
        <Grid2 item xs={12} sm={6} md={3}>
          <Box className="panel">
            <Typography variant="h6" className="section-title">
              Crença
            </Typography>
            <Typography className="content-text">
              A crença varia de pessoa para pessoa, podendo ser em Deus ou em algo que está fora deste plano e pode intervir quando quiser.
              <br />
              Através de experiências próprias, criei uma tecnologia que facilita outras pessoas a experienciar isso de forma mais "econômica", usando como referência a minha experiência única, no sentido de esforço divino para intervir quando desejar.
            </Typography>
          </Box>
        </Grid2>

        {/* Fiction Panel */}
        <Grid2 item xs={12} sm={6} md={3}>
          <Box className="panel">
            <Typography variant="h6" className="section-title">
              Ficção
            </Typography>
            <Typography className="content-text">
              Interestellar ilustra bem a ideia de como alguém fora do plano pode se comunicar com quem está dentro.
              <br />
              Cena:
              <br />
              Gravidade (permeia ambos os planos) – Física teórica, mecânica clássica, relatividade geral.
              <br />
              Atualmente, há uma tentativa de unificar a gravidade na mecânica quântica com a teoria das cordas.
            </Typography>
            <Typography className="content-text">
              Relógio quebrado – Serve como meio para transcrever a mensagem entre os planos.
            </Typography>
            <Typography className="content-text">
              Código Morse – Usado como padrão de comunicação para entender-se entre os planos.
            </Typography>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default QuantumCommunication;