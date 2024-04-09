import Booking from "./Booking";
import Offers from "./Offers";
import OmOss from "./OmOss";
import OpeningTimes from "./OpeningTimes";

function Meny() {
    return (
        <div id='headerField'>
        <div className='container'>
  
        <h1 id='head1'>Heaven SPA</h1>
  
       <div id='linksHeadMenue'>
       <OmOss/>
       <Offers/>
       <Booking/>
       <OpeningTimes/>
       </div>
    
         </div>
      </div>
    );
}

export default Meny;