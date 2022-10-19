import router from 'next/router';
import React, { useEffect } from 'react';

export default function withAuth(Component) {
  return ({ ...props }) => {
    const user = true;
    const tokenExpire = true;

    useEffect(() => {
      if (user === false) router.replace('/auth/signin');
      if (tokenExpire === false) router.replace('/auth/lockscreen');
    }, [user]);

    if (user === false) return null;

    return <Component {...props} />;
  };
}
