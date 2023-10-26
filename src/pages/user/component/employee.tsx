import React, { useMemo, useState } from 'react'
import { GlobalConfig } from '~/config/GlobalConfig';
import { api } from '~/utils/api';

const employee = () => {
    const createJobname = api.Permission.create.useMutation(GlobalConfig.tanstackOption);
    
  return (
    <div>employee</div>
  )
}

export default employee