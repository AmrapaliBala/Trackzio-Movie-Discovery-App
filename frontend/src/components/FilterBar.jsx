import CategoryMenu from "./CategoryMenu";
import SortMenu from "./SortMenu";


const FilterBar = () => {

  return (

    <div className="space-y-4">

      <CategoryMenu />

      <div className="flex justify-end">

        <SortMenu />

      </div>

    </div>
  );
};


export default FilterBar;