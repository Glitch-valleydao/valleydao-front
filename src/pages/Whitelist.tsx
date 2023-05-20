import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import ArticleDaoABI from "../abi/Article_DAO.json";
import { Article_DAO } from "../../types";
import Logo from "../assets/tweetbox.jpeg";

import { BigNumber, ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";

import backgroundwhite2 from "../assets/backgroundwhitelist2.jpg";

import type { TokenSymbol } from "@web3-onboard/common";

// Define the interface for the customer data

interface RecruitBoxProps {
  recruit: member;
}
interface member {
  id: number;
  handle: string;
}

const Descript = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #236480;

  margin-bottom: 20px;
`;

const ContentWrapBox = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;

  width: 250px;
  height: 60px;
  border-radius: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-image: url(${Logo});
  background-size: 80px; /* 이미지 크기 조정 */
  background-repeat: no-repeat;
  background-position: right center; /* 오른쪽 가운데에 위치 */
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
    box-shadow: 0 0 0 1px rgb(0 0 0 / 4%), 0 2px 4px rgb(0 0 0 / 4%),
      0 8px 24px rgb(0 0 0 / 8%);
  }
  background-color: white;
`;
const ContentTextBox = styled.div`
  display: flex;
  margin-left: 20px;
  p {
    font-family: "Noto Sans KR", sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: #077fb3;
  }
`;

const RecruitBox: React.FC<RecruitBoxProps> = ({ recruit }) => {
  return (
    <ContentWrapBox>
      <ContentTextBox>
        <p>Tweet: {recruit.handle}</p>
      </ContentTextBox>
    </ContentWrapBox>
  );
};

// const recruits: member[] = [
//   {
//     id: 1,
//     handle: "@John Doe",
//     state: 0,
//   },
//   {
//     id: 2,
//     handle: "@Jane Doe",
//     state: 0,
//   },
//   {
//     id: 3,
//     handle: "@John Smith",
//     state: 0,
//   },
//   {
//     id: 4,
//     handle: "@Jane Smith",
//     state: 0,
//   },
// ];

interface PendingBoxProps {
  pending: member;
}

const PendingBox: React.FC<PendingBoxProps> = ({ pending }) => {
  return (
    <ContentWrapBox>
      <ContentTextBox>
        <p>Tweet: {pending.handle}</p>
      </ContentTextBox>
    </ContentWrapBox>
  );
};

// const pendings: member[] = [
//   {
//     id: 1,
//     handle: "@John Doe",
//     state: 0,
//   },
//   {
//     id: 2,
//     handle: "@Jane Doe",
//     state: 0,
//   },
//   {
//     id: 3,
//     handle: "@John Smith",
//     state: 0,
//   },
//   {
//     id: 4,
//     handle: "@Jane Smith",
//     state: 0,
//   },
// ];

// const whitelists: member[] = [
//   {
//     id: 1,
//     handle: "@John Doe",
//     state: 0,
//   },
//   {
//     id: 2,
//     handle: "@Jane Doe",
//     state: 0,
//   },
//   {
//     id: 3,
//     handle: "@John Smith",
//     state: 0,
//   },
//   {
//     id: 4,
//     handle: "@Jane Smith",
//     state: 0,
//   },
//   {
//     id: 5,
//     handle: "@John Doe",
//     state: 0,
//   },
// ];
let provider;

interface Account {
  address: string;
  balance: Record<TokenSymbol, string> | null;
  ens: { name: string | undefined; avatar: string | undefined };
}

const Whitelist = () => {
  const [{ wallet }] = useConnectWallet();
  const [ids, setIds] = useState<any[] | null | undefined>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(
    null
  );
  const [maxIndex, setMaxIndex] = useState<number>(0);
  const [recruitList, setRecruitList] = useState<any[] | null | undefined>([]);
  const [pendingList, setPendingList] = useState<any[] | null | undefined>([]);
  const [whiteUserList, setWhiteUserList] = useState<any[] | null | undefined>(
    []
  );

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

      const contract: Article_DAO = new ethers.Contract(
        "0xa412aE23B3b49B2B68e6A3539F5855cc734cd5B0",
        ArticleDaoABI,
        provider.getUncheckedSigner()
      ) as Article_DAO;

      const getUsersList = async () => {
        const max = await contract?.getregisternum();
        const maxNum = max.toNumber();
        console.log(maxNum);
        for (let i = 0; i < maxNum; i++) {
          const register = await contract?.getWregister(i);
          console.log(register);
          if (register.state.toNumber() === 0) {
            setRecruitList((prev) => [
              { ...recruitList, id: i, handle: register.handle },
            ]);
          } else if (register.state.toNumber() === 1) {
            setPendingList((prev) => [
              { ...prev, id: i, handle: register.handle },
            ]);
          } else if (register.state.toNumber() === 4) {
            setWhiteUserList((prev) => [
              { ...prev, id: i, handle: register.handle },
            ]);
          }
        }
      };
      getUsersList();

      // const getReqruitlist = async () => {
      //   const balance = await contract.balanceOf(wallet.accounts[0].address);
      //   setMyToken(balance.toString());
      // };
    }
  }, [wallet?.provider]);

  // const registerWhiteList = async () => {
  //   if (!wallet?.provider || !account || !signer) {
  //     alert("Connect Wallet");
  //     return;
  //   }

  //   const contract: Article_DAO = new ethers.Contract(
  //     "0xa412aE23B3b49B2B68e6A3539F5855cc734cd5B0",
  //     ArticleDaoABI,
  //     signer
  //   ) as Article_DAO;
  //   const tx = await contract?.approve(
  //     "0xa412aE23B3b49B2B68e6A3539F5855cc734cd5B0",
  //     BigNumber.from("1")
  //   );
  //   await tx.wait();

  //   const writerRegistertx = await contract?.writerRegister(
  //     BigNumber.from("1")
  //   );
  //   await writerRegistertx.wait();

  //   // const tx = await contract?.writerRegister(BigNumber.from("1"));

  //   alert("Success");
  // };

  // const getWriterids = async () => {
  //   if (!wallet?.provider || !account || !signer) {
  //     alert("Connect Wallet");
  //     return;
  //   }
  //   const contract: Article_DAO = new ethers.Contract(
  //     "0x6F810f01cdFA86bEA4F4ad8c96be278d98B73D79",
  //     ArticleDaoABI,
  //     signer
  //   ) as Article_DAO;
  //   console.log(contract);
  //   const tx = await contract?.wRegisterids(BigNumber.from("2"));
  //   alert(tx);
  // };

  // const getWriterLists = async () => {
  //   if (!wallet?.provider) {
  //     alert("Connect Wallet");
  //     return;
  //   }
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   const provider = new ethers.providers.Web3Provider(wallet.provider, "any");
  //   const signer = provider.getUncheckedSigner();

  //   const contract: Article_DAO = new ethers.Contract(
  //     "0x28504b5182FF1944894A0dc684ca139733201783",
  //     ArticleDaoABI,
  //     signer
  //   ) as Article_DAO;
  //   const tx = await contract.writerRegister(
  //     "0x28504b5182FF1944894A0dc684ca139733201783"
  //   );

  //   tx.wait();

  //   alert("Success");
  // };

  return (
    <Container>
      <TitleWrap>
        <Title>Whitelist</Title>

        <Link to={"register"}>
          <StyledButton> 작가 등록</StyledButton>
        </Link>
        {/* <StyledButton onClick={getWriterids}> 작가 리스트</StyledButton> */}
      </TitleWrap>
      <ListWrap>
        <RecruitWrap>
          <h2>Recruit</h2>
          <Descript>현재 등록을 원하는 사람들의 리스트입니다.</Descript>
          <CustomerList>
            {recruitList &&
              recruitList.map((recruit) => (
                <>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    to={`recruit/${recruit.id}`}
                  >
                    <RecruitBox key={recruit.id} recruit={recruit} />
                  </Link>
                </>
              ))}
            {/* {recruits.map((recruit) => (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  to={`recruit/${recruit.id}`}
                >
                  <RecruitBox key={recruit.id} recruit={recruit} />
                </Link>
              </>
            ))} */}
          </CustomerList>
        </RecruitWrap>
        <PendingWrap>
          <h2>Pending</h2>
          <Descript>현재 투표중인 사람들의 리스트입니다.</Descript>
          <CustomerList>
            {pendingList &&
              pendingList.map((pending) => (
                <>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    to={`pending/${pending.id}`}
                  >
                    <PendingBox key={pending.id} pending={pending} />
                  </Link>
                </>
              ))}

            {/* {pendings.map((pending) => (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  to={`pending/${pending.id}`}
                >
                  <PendingBox key={pending.id} pending={pending} />
                </Link>
              </>
            ))} */}
          </CustomerList>
        </PendingWrap>
        <WhitelistWrap>
          <h2>Whitelist</h2>
          <Descript>등록이 완료된 사람들의 리스트입니다.</Descript>
          <CustomerList>
            {whiteUserList &&
              whiteUserList.map((whiteUser) => (
                <>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    to={`https://twitter.com/${whiteUser.handle}}`}
                  >
                    <ContentWrapBox>
                      <ContentTextBox>
                        <p>Tweet: {whiteUser.handle}</p>
                      </ContentTextBox>
                    </ContentWrapBox>
                  </Link>
                </>
              ))}

            {/* {whitelists.map((customer) => (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  to={`https://twitter.com/${customer.handle}}`}
                >
                  <ContentWrapBox>
                    <ContentTextBox>
                      <p>Tweet: {customer.handle}</p>
                    </ContentTextBox>
                  </ContentWrapBox>
                </Link>
              </>
            ))} */}
          </CustomerList>
        </WhitelistWrap>
      </ListWrap>
    </Container>
  );
};

export default Whitelist;

// Styled component for the Whitelist page
const Container = styled.div`
  padding: 20px;
  background-image: url(${backgroundwhite2});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;
const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 100px;
  height: 30px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
`;

const ListWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
`;
const RecruitWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PendingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WhitelistWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CustomerList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const TitleWrap = styled.div`
  display: flex;

  align-items: center;
`;
