// style.js
export const useStyles = () => {
  return {
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box',
    },
    navy: {
      backgroundColor: '#003080',
    },
    center: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    main: {
      flex: 1,
      overflow: 'auto',
      flexDirection: 'column',
      display: 'flex',
      color: '#ffffff',
    },
    largeLogo: {
      height: 100,
    },
    logo: {
      height: 50,
    },
    content: {
      marginBottom: '20px',
    },
    cards: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '50px',
    },
    card: { 
      width: '200px',
    },
    card_review: {
      width: '80%',
      marginLeft: '40px',
      marginTop: '12px',
    },
    media: {
      width: '100%',
      height: 'auto',
    },
    largeButton: {
      width: 250,
    },
    largeInput: {
      width: '60px !important',
      padding: '0 !important',
      fontSize: '35px !important',
      textAlign: 'center!important',
    },
    bordered: {
      borderWidth: 2,
      padding: 1,
      margin: 5,
      borderStyle: 'solid',
    },
    row: {
      display: 'flex',
      paddingBottom: 3,
    },
    around: {
      justifyContent: 'space-around',
    },
    between: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    column: {
      flexDirection: 'column',
    },
  };
};
