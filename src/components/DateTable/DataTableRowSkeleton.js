import React from 'react';

const DataTableRowSkeleton = () => {
    return (
        <tr className="data-table__row data-table__row--skeleton">
            <td className="data-table__cell data-table__cell--date data-table__cell--skeleton">
                &nbsp;
            </td>
            <td className="data-table__cell data-table__cell--company data-table__cell--skeleton">
                &nbsp;
            </td>
            <td className="data-table__cell data-table__cell--account data-table__cell--skeleton">
                &nbsp;
            </td>
            <td className="data-table__cell data-table__cell--amount data-table__cell--skeleton">
                &nbsp;
            </td>
        </tr>
    );
};

export default DataTableRowSkeleton;
