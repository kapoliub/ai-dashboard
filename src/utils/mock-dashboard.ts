export interface Analytics {
  chart: { name: string; users: number }[];
}

export interface MonthlySales {
  sales: { name: string; sales: number }[];
}

export interface UserRoles {
  users: { name: string; value: number }[];
}

export interface RecentActivity {
  activity: { text: string }[];
}

export const getAnalytics = async (): Promise<Analytics> => {
  return new Promise(res => {
    setTimeout(() => res({
      chart: [
        { name: 'Jan', users: 430 },
        { name: 'Feb', users: 680 },
        { name: 'Mar', users: 520 },
        { name: 'Apr', users: 900 },
        { name: 'May', users: 750 },
      ]
    }), 1000);
  });
};

export const getMonthlySales = async (): Promise<MonthlySales> => {
  return new Promise(res => {
    setTimeout(() => res({
      sales: [
        { name: 'Jan', sales: 2400 },
        { name: 'Feb', sales: 3200 },
        { name: 'Mar', sales: 2800 },
        { name: 'Apr', sales: 3900 },
        { name: 'May', sales: 3600 },
      ]
    }), 1500);
  });
};

  export const getUserRoles = async (): Promise<UserRoles> => {
    return new Promise(res => {
      setTimeout(() => res({
        users: [
          { name: 'Admin', value: 5 },
          { name: 'Editor', value: 23 },
          { name: 'Viewer', value: 100 },
        ]
      }), 500);
    });
  };
  
  export const getRecentActivity = async (): Promise<RecentActivity> => {
    return new Promise(res => {
      setTimeout(() => res({
        activity: [
          { text: 'Alice created a new product.' }, 
          { text: 'Bob updated his profile.' },
          { text: 'Charlie deleted a user.' },
          { text: 'New order received.' },
        ]
      }), 5000);
    });
  };


