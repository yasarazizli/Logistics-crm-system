import {useTranslation} from "react-i18next";

const Home = () => {
    const {t} = useTranslation();
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden",display:'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{fontSize:'32px',fontWeight:"bold",color:"#1D736B"}}>{t('home.title')}</div>
    </div>
  );
};
export default Home;
