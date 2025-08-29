# Endpoints the frontend is expecting

GET   /api/challenges/[slug]                        -> returns a single challenge by slug
GET   /api/challenges                               -> returns list of challenges

GET   /api/tournaments/[slug]                       -> returns a single tournament by slug
GET   /api/tournaments                              -> returns list of tournaments

GET   /api/custom-codes/[slug]                      -> returns a single custom-code by slug
GET   /api/custom-codes                             -> returns list of custom-codes

GET   /api/creators/[slug]                          -> returns a single creator by slug

GET   /api/faqs                                     -> returns list of faqs

POST  /api/submissions                              -> adds a submission

POST  /api/ideas                                    -> adds an idea


### Notes

- all list endpoints, should take in params for paging
- all single entity endpoints (get by slug) should be fully populated
- post requests should be secured following best practices to prevent abuse (anonymous post requests, no user management)