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
import Logo from "../../assets/articlebox.jpeg";

interface member {
  id: number;
  handle: string;
}

interface PendingBoxProps {
  pending: member;
  setSelectedUser: (handle: string | null) => void;
}

const PendingBox: React.FC<PendingBoxProps> = ({
  pending,
  setSelectedUser,
}) => {
  return (
    <ContentWrapBox
      onClick={() => {
        setSelectedUser(pending.handle);
      }}
    >
      <ContentTextBox>
        <p>Tweet: {pending.handle}</p>
      </ContentTextBox>
    </ContentWrapBox>
  );
};
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

let provider;
function ProposalPending() {
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

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [myhandle, setMyHandle] = useState<string>("");

  const pendings: member[] = [
    {
      id: 1,
      handle: "@John Doe",
    },
    {
      id: 2,
      handle: "@Jane Doe",
    },
    {
      id: 3,
      handle: "@John Smith",
    },
    {
      id: 4,
      handle: "@Jane Smith",
    },
  ];

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
      "0xa334b3B9eBcbdac00bEC120fB17d25367018662e",
      ArticleDaoABI,
      signer
    ) as Article_DAO;
    setLoading(true);
    const tx = await contract?.approve(
      "0xa334b3B9eBcbdac00bEC120fB17d25367018662e",
      BigNumber.from("1")
    );
    await tx.wait();

    const writerRegistertx = await contract?.writerRegister(
      BigNumber.from("1")
    );
    await writerRegistertx.wait();

    // const tx = await contract?.writerRegister(BigNumber.from("1"));
    setLoading(false);
    alert("Success");
  };
  const handleOptionSelect = (option: boolean) => {
    setSelectedOption(option);
  };

  return (
    <Container>
      {loading && <Loading />}
      <Wrap>
        <PendingWrap>
          {/* <h1>WhiteList Pending</h1> */}
          <RowWrap>
            <LeftWrap>
              {/* <UserName>UserName : {param.userId}</UserName> */}
              <h2>투표 참여</h2>
              <Descript>트윗 헤더를 제출하고 투표에 참가합니다.</Descript>
              <InputWrap>
                <MySelectUser>My Tweet Header</MySelectUser>

                <input
                  type="string"
                  value={myhandle}
                  onChange={(e) => setMyHandle(e.target.value)}
                />
              </InputWrap>
              <button>안건에 글쓰고 들어가기</button>
            </LeftWrap>

            <RightWrap>
              <PendingWrap>
                <h2>Pending</h2>
                <Descript>현재 투표가 진행중인 글들의 목록입니다.</Descript>
                <CustomerList>
                  {pendings.map((pending) => (
                    <>
                      <PendingBox
                        key={pending.id}
                        pending={pending}
                        setSelectedUser={setSelectedUser}
                      />
                    </>
                  ))}
                </CustomerList>
                <MySelectUser> 내가 선택한 유저: {selectedUser}</MySelectUser>
              </PendingWrap>

              <button onClick={registerWhiteList}>Submit</button>
            </RightWrap>
          </RowWrap>
        </PendingWrap>
      </Wrap>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  width: 100vw;

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
const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  input {
    width: 200px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;
const MySelectUser = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const Wrap = styled.div`
  display: flex;
  width: 900px;
  height: 800px;
  border: 1px solid #ccc;
  background-color: white;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 4%), 0 2px 4px rgb(0 0 0 / 4%),
    0 8px 24px rgb(0 0 0 / 8%);
`;
const Descript = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #236480;

  margin-bottom: 20px;
`;

const CustomerList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftWrap = styled.div`
  display: flex;
  height: 800px;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
`;

const RightWrap = styled.div`
  display: flex;
  height: 800px;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
`;

const Description = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 15px;
  font-weight: bold;
  width: 300px;
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

export default ProposalPending;
