describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("does something", () => {
    cy.visit("/");
  });
});
