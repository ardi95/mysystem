export const dataWarningSA = ({
  title,
  html,
  confirmButtonText = null,
  icon,
  confirmButtonColor,
  denyButton,
}) => {
  if (confirmButtonText === null) {
    confirmButtonText = 'Save'
  }

  const data = {
    customClass: {
      denyButton: denyButton ? denyButton : 'btnDeny',
    },
    icon: icon ? 'warning' : false,
    title,
    html,
    showDenyButton: true,
    confirmButtonText,
    confirmButtonColor: confirmButtonColor ? confirmButtonColor : '#3989DA',
    denyButtonText: `Cancel`,
    denyButtonColor: '#3989DA',
    reverseButtons: true,
  }

  return data
}

export const metaRoute = () => {
  const data = {
    home: {
      title: 'Home'
    },

    users: {
      title: 'Users'
    },

    menu: {
      title: 'Menu'
    },

    role: {
      title: 'Role'
    },

    rolemenu: {
      title: 'Role Menu'
    },

    historyratecustomer: {
      title: 'History Rate Customer'
    },
    
    debtur: {
      title: 'Debtur'
    }
  }
  
  return data
}