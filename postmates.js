/**
 * Created by Joseph on 1/22/16.
 */


var POSTMATES_URL = "https://api.postmates.com";

/**
 * Create Delivery Function
 * Creates a POST request to the Postmates API to enque an order
 *
 * USAGE:
 * quote_id (OPTIONAL)
 *      The ID of a previously generated delivery quote.
 *      Optional, but recommended.
 *      Example: "del_KSsT9zJdfV3P9k"
 * manifest
 *      A detailed description of what the courier will be delivering.
 *      Example: "A box of gray kittens"
 * manifest_reference (OPTIONAL)
 *      Optional reference that identifies the manifest.
 *      Example: "Order #690"
 * pickup_name
 *      Name of the place where the courier will make the pickup.
 *      Example: "Kitten Warehouse"
 * pickup_address
 *      The pickup address for the delivery.
 *      Example: "20 McAllister St, San Francisco, CA"
 * pickup_phone_number
 *      The phone number of the pickup location.
 *      Example: "415-555-4242"
 * pickup_business_name (OPTIONAL)
 *      Optional business name of the pickup location.
 *      Example: "Feline Enterprises, Inc."
 * pickup_notes
 *      Additional instructions for the courier at the pickup location.
 *      Example: "Ring the doorbell twice, and only delivery the package if a human answers."
 * dropoff_name
 *      Name of the place where the courier will make the dropoff.
 *      Example: "Alice"
 * dropoff_address
 *      The dropoff address for the delivery.
 *      Example: "678 Green St, San Francisco, CA"
 * dropoff_phone_number
 *      The phone number of the dropoff location.
 *      Example: "415-555-8484"
 * dropoff_business_name (OPTIONAL)
 *      Optional business name of the dropoff location.
 *      Example: "Alice's Cat Cafe"
 * dropoff_notes
 *      Additional instructions for the courier at the dropoff location.
 *      Example: "Tell the security guard that you're here to see Alice."
 *
 */
function createDelivery(quote_id, manifest, manifest_reference, pickup_name,
                        pickup_address, pickup_phone_number, pickup_business_name,
                        pickup_notes, dropoff_name, dropoff_address,
                        dropoff_phone_number, dropoff_business_name, dropoff_notes) {
    var createUrl = "/v1/customers/:customer_id/deliveries";
    var data = {"quote_id" : quote_id, "manifest" : manifest,
        "manifest_reference" : manifest_reference, "pickup_name" : pickup_name,
        "pickup_address" : pickup_address, "pickup_phone_number" : pickup_phone_number,
        "pickup_business_name" : pickup_business_name, "pickup_notes" : pickup_notes,
        "dropoff_name" : dropoff_name, "dropoff_address" : dropoff_address,
        "dropoff_phone_number" : dropoff_phone_number,
        "dropoff_business_name" : dropoff_business_name, "dropoff_notes" : dropoff_notes
    };
    $.ajax({
        type: "POST",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization",
                "Basic Y2YyZjJkNmQtYTMxNC00NGE4LWI2MDAtNTA1M2MwYWYzMTY1Og==");
        },
        url: POSTMATES_URL + createUrl,
        data: data,
        success: function(msg) {
            console.log("Successfully created delivery: " + msg)
        }
    });
}

