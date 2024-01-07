// /*
//  * Copyright (c) 2024. 
//  * @49nhn 
//  */
//
// import React, { useState } from "react";
// import { Pagination } from "@nextui-org/react";
//
// const bottomContent =()=> {
//     const [page, setPage] = useState(1);
//    
//    
//    
//     React.useMemo(() => {
//         return (
//             <div className="py-2 px-2 flex justify-between items-center">
//                 <Pagination
//                     showControls
//                     classNames={{
//                         cursor: "bg-foreground text-background",
//                     }}
//                     color="default"
//                     // isDisabled={hasSearchFilter}
//                     page={page}
//                     total={pages}
//                     variant="light"
//                     onChange={setPage}
//                 />
//                 <span className="text-small text-default-400">
//           {selectedKeys === "all"
//               ? "All items selected"
//               : `${selectedKeys.size} of ${items.length} selected`}
//         </span>
//             </div>
//         );
//     }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
// }