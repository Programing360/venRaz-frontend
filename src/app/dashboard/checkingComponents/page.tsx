"use client"
import { AddProductModal } from '@/components/addProductModal';
import { CloudinarySettingsModal } from '@/components/cloudinarySettingModal';
import { EditShopModal } from '@/components/editShopModal';
import { SellerDashboardView } from '@/components/sellerDashboardView';

import { UserDashboardView } from '@/components/userDashboard';

import React from 'react';

const page = () => {
    return (
    // here i check my compoents are work or not properly 
        <div>
           <AddProductModal/>
           <CloudinarySettingsModal/>
           <EditShopModal/>
           <UserDashboardView/>
          
           <SellerDashboardView/>
           
        </div>
    );
};

export default page;