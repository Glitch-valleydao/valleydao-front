import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Article_DAO } from "../../../types";
import { Account } from "../../interfaces/account.interface";
import ArticleDaoABI from "../../abi/Article_DAO.json";
import Loading from "../common/Loading";
import { useConnectWallet } from "@web3-onboard/react";
import { BigNumber, ethers } from "ethers";
import backgroundwhite2 from "../../assets/backgroundwhitelist2.jpg";

let provider;
function Pending() {
  const param = useParams<{ userId: string }>();
  const [selectedOption, setSelectedOption] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [usedToken, setUsedToken] = useState<number>(0);
  const [{ wallet }, connect, disconnect, updateBalance, setWalletModules] =
    useConnectWallet();

  const [account, setAccount] = useState<Account | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!wallet?.provider) {
      provider = null;
    } else {
      const { name, avatar } = wallet?.accounts[0].ens ?? {};
      setAccount({
        address: wallet.accounts[0].address,
        balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
      });
      provider = new ethers.providers.Web3Provider(wallet.provider, "any");
      setSigner(provider.getUncheckedSigner());
    }
  }, [wallet?.provider]);

  const registerWhiteList = async () => {
    if (!wallet?.provider || !account || !signer) {
      alert("Connect Wallet");
      return;
    }

    const contract: Article_DAO = new ethers.Contract(
      "0x6F810f01cdFA86bEA4F4ad8c96be278d98B73D79",
      ArticleDaoABI,
      signer
    ) as Article_DAO;
    setLoading(true);
    // const tx = await contract?.approve(
    //   "0x6F810f01cdFA86bEA4F4ad8c96be278d98B73D79",
    //   BigNumber.from("1")
    // );
    // await tx.wait();
    try {
      const writerRegistertx = await contract?.voteRegister(
        BigNumber.from("1"),
        selectedOption
      );
      await writerRegistertx.wait();
      // const tx = await contract?.writerRegister(BigNumber.from("1"));
      setLoading(false);
      alert("Success");
    } catch (e) {
      setLoading(false);
      alert("error");
    }
  };
  const handleOptionSelect = (option: boolean) => {
    setSelectedOption(option);
  };

  return (
    <Container>
      {loading && <Loading />}
      <Wrap>
        <PendingWrap>
          <h1>WhiteList Pending</h1>
          <UserName>UserName : {param.userId}</UserName>
          <Description>token submit에 대한 주의사항 및 설명</Description>
          <ButtonWrap>
            <StyledButton onClick={() => handleOptionSelect(true)}>
              O
            </StyledButton>
            <StyledButton2 onClick={() => handleOptionSelect(false)}>
              X
            </StyledButton2>
          </ButtonWrap>
          <Selected isSelected={selectedOption}>
            {selectedOption === true ? "O" : "X"}
          </Selected>
          <button onClick={registerWhiteList}>Submit</button>
        </PendingWrap>
      </Wrap>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  background-image: url(${backgroundwhite2});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Selected = styled.div<{ isSelected: boolean }>`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: ${(props) => (props.isSelected ? "green" : "red")};
`;

const Wrap = styled.div`
  display: flex;
  width: 600px;
  height: 500px;
  border: 1px solid #ccc;
  background-color: white;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 4%), 0 2px 4px rgb(0 0 0 / 4%),
    0 8px 24px rgb(0 0 0 / 8%);
`;

const Description = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;

  font-size: 15px;
  font-weight: bold;
  width: 500px;
  height: 100px;
  margin-bottom: 20px;
  background-color: #eee;
`;

const PendingWrap = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  background-color: #2ff215;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #148604;
  }
`;
const StyledButton2 = styled.button`
  background-color: #ea0707;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #ab0909;
  }
`;
const ButtonWrap = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-between;
`;

export default Pending;
